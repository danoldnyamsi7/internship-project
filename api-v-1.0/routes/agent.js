const bcrypt = require("bcryptjs");
const Router = require("express").Router();
const { cloudinary } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const Agent = require("../models/Agent");
const Hall = require("../models/Hall");
const { verifyToken } = require("../utils/verify_token");
const Axios = require("axios");
const Reservation = require("../models/Reservation");
const Organizer = require("../models/Organizer");
const { validateAgent, validateAgentLogin, validatePwd } = require("../utils/validation");


// create new agent
Router.post('/register', async (req, res) => {
      const { error } = validateAgent(req.body);
      if (error) console.log(error)
      if (error) return res.status(400).json({ error: true, success: false, data: {}, message: error.details[0].message });
      const agent = await Agent.findOne({ contact: req.body.contact });
      if (agent) return res.status(400).json({ error: true, success: false, data: {}, message: "account already exists" })
      const { password } = req.body;
      let salt = await bcrypt.genSalt(10);
      let hash_pwd = await bcrypt.hash(password, salt);

      const file = req.body.picture;
      const config = {
            upload_preset: "dev_setups_halls"
      }
      // upload file to cloudinary

      try {

            //       const uploadToCloudinary = await cloudinary.uploader.upload(file, config, (result)=>{
            //             const picture = {
            //                  public_id: result.public_id,
            //                  url: result.url,
            //                  asset_id: result.asset_id,
            //            }
            //            return picture;
            //      })
            const uploadToCloudinary = await cloudinary.uploader.upload(file, config)
                  .then(result => {
                        const picture = result.url;
                        return picture;
                  })
                  .catch(error => { return console.log(error) })

            req.body.picture = uploadToCloudinary;

            const agent = await Agent.create({
                  name: req.body.name,
                  contact: req.body.contact,
                  password: hash_pwd,
                  picture: req.body.picture

            })

            return res.status(201).json({ error: false, success: true, data: agent, message: "agent created successfuly" });

      } catch (error) {
            console.log(error);
            return res.status(400).send({ error: error, success: false, data: {}, message: "couldn't signin try again" });
      }

})

// login Agent
Router.post('/signin', async (req, res) => {
      // validation 

      const { error } = validateAgentLogin(req.body);
      if (error) return res.status(400).send({ error: true, success: false, data: {}, message: error.details[0].message });

      // verification
      const { contact, password } = req.body;
      const agent = await Agent.findOne({ contact: contact });
      if (!agent) return res.status(404).json({ error: error, success: false, data: {}, message: "Account doesnt't exists" });
      const isPassword = await bcrypt.compare(password, agent.password);
      if (!isPassword) return res.status(400).json({ error: true, success: false, data: {}, message: "invalid password, please try again" });


      // create an access token
      try {
            const access_token = jwt.sign({ _id: agent._id }, process.env.ACCESS_TOKEN, { expiresIn: "30d" });
            return res.header("access_token", access_token).json({ error: false, success: true, token: access_token, agent: agent, message: "login successfuly!" });

      } catch (error) {
            console.log(error)
            return res.status(400).send({ error: error, success: false, data: {}, message: error.message });
      }

})

// logout 
Router.get("/logout", verifyToken, async (req, res) => {
      let token = req.header("access_token");
      token = req.header("access_token", " ");
      return res.header("access_token", token).send({ message: "user logged out", token: token });
})

//agent profile
Router.get('/profile', verifyToken, async (req, res) => {
      try {
            const current_user = await Agent.findById(req.agent._id).populate('halls');
            if (!current_user) return res.status(400).send({ message: "you can only access your account" });
            // console.log(current_user);
            return res.status(200).json({ error: false, success: true, data: current_user, message: " admin profile" });
      } catch (error) {
            console.log({ error: error });
            return res.status(400).send({ error: true, message: error, success: false })
      }

})

// forgot password


// modify password
Router.patch("/change-password", verifyToken, async (req, res) => {
      const { error } = validatePwd(req.body);
      if (error) return res.status(400).send({ error: error.details[0].message });

      const { contact } = req.body;
      const agent = await Agent.findOne({ contact: contact });
      const current_user = await Agent.findById(req.agent._id);
      if (agent.contact != current_user.contact) return res.status(400).send({ error: true, success: false, data: {}, message: "you can only access your account" });

      const new_pwd = req.body.password;
      let salt = await bcrypt.genSalt(10);
      let hash_pwd = await bcrypt.hash(new_pwd, salt);

      try {

            await Agent.findByIdAndUpdate(req.agent._id, { password: hash_pwd }).then(agent => {
                  return res.status(200).json({ error: false, success: true, data: agent, message: 'password reset' })
            });
      } catch (error) {
            return res.status(400).send({ error: true, success: false, data: {}, message: error });
      }


})

//update Agent
Router.patch('/update-profile', verifyToken, async (req, res) => {
      const { error } = validateAgent(req.body);
      console.log('body: ', req.body);
      if (error) console.log(error);
      if (error) return res.status(400).json({ error: true, success: false, data: {}, message: error.details[0].message });

      // const agent = await Agent.findOne({ contact: req.body.contact });
      // const current_user = await Agent.findById(req.agent._id);
      // if (agent.contact != current_user.contact) return res.status(400).json({ error: true, success: false, data: {}, message: "you can only access your account" });


      try {
            const file = req.body.picture;
            const config = {
                  upload_preset: "dev_setups_halls"
            }
            const uploadToCloudinary = await cloudinary.uploader.upload(file, config)
                  .then(result => {
                        const picture = result.url;
                        return picture;
                  })
                  .catch(error => { return console.log(error) })

            req.body.picture = uploadToCloudinary;


            const update = await Agent.findByIdAndUpdate(req.agent._id, req.body).populate("Reservation");
            const actualUpdate = await Agent.findById(update._id);
            return res.status(200).json({ error: false, success: true, data: actualUpdate, message: "profile updated successfuly" });

      } catch (error) {
            return res.status(400).send({ error: error, success: false, data: {}, message: "could not update agent's profile" });
      }


})

//delete Agent
Router.delete('/delete-agent', verifyToken, async (req, res) => {

      // const agent = await Agent.findOne({ contact: req.body.contact });
      const current_user = await Agent.findById({ _id: req.agent._id });
      const isPwd = await bcrypt.compare(req.body.password, current_user.password);
      if (!isPwd) return res.status(400).send({ error: true, success: false, data: {}, message: "wrong password" });
      // if (!(isPwd && current_user)) return res.status(400).send({ error: true, success: false, data: {}, message: "you can only access your account" });

      try {
            await Agent.findByIdAndDelete(req.agent._id).populate("Reservation");
            return res.status(204).json({ error: false, success: false, data: {}, message: "Agent deleted success!" });
      } catch (error) {
            return res.status(400).send({ error: error, success: false, data: {}, message: "couldn not delete the user account", });
      }
})

//validate Booking
Router.post("/notify-agent", async (req, res) => {
      // find agent's hall
      console.log({ request_Body_In_Noitify_Agent_Route: req.body })
      
      try {
            await Agent.findOne({ halls: req.body.hall_id }).then(async agent => {
                  // find agent that has the hall id in his hall array
      
                  // check in the agenda of the hall if the date already exists
                  let hall = await Hall.findOne({ agent: agent._id }).populate("agent");
                  
              
                  // if (hall.reservations.includes(req.body.date)) return res.status(400).json({ error: true, success: false, data: {}, message: "already reserved" });
                  // make a request to the validate reservation endpoint
                  req.body.agent_id = hall.agent;
                 
                  const reservation = await Reservation.create({
                        hall_id: req.body.hall_id,
                        agent_id: hall.agent._id,
                        date: req.body.date,
                        event: req.body.event,
                        organizer_id: req.body.organizer_id,
                        bargain_price: req.body.bargain_price,
                  });

                  const newReservation = await Reservation.findById(reservation._id).populate('agent_id').populate('organizer_id').populate('hall_id');
               
                  await Organizer.findByIdAndUpdate(req.body.organizer_id, {
                        $push: {reservations: newReservation._id}
                  }).populate('reservations')

                  // await Hall.findByIdAndUpdate(req.body.hall_id, {
                  //       $push: {reservations: newReservation._id}
                  // }).populate('reservations')

                  console.log({ reservation: reservation });
      
                  // try {
      
                  //       const organizer = await Organizer.findByIdAndUpdate(reservation.organizer_id, { $push: { reservation: reservation } })
                  //       console.log({ organizer: organizer });
                  //       // return res.status(200).json({ error: false, success: true, data: reserva, message: "a message has been sent to the hall agent, he will contact you for the deal" });
                  // } catch (error) {
                  //       console.log("the organizer's events array wasn't updated", { error: error })
                  // }
      
                  return res.status(200).json({ error: false, success: true, data: newReservation, message: "available" });
                  // how can I NOTIFY the agent without using push nofications
      
                  // should be done at the frontend
      
                  // Axios({
                  //       method: "post",
                  //       url: `${process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/agents/validate-reservation'}`,
                  //       data:{
                  //             date: req.body.data.date,
                  //             event: req.body.data.event,
                  //             hall_id: req.body.data.hall_id
                  //       }
                  // })
      
            }) 
      } catch (error) {
            console.log({notifError:error});
      }

     


})

// Get Prospects Appointments
Router.get("/pending-reservations", verifyToken, async (req, res) => {
      // const agent = await Agent.findOne({ contact: contact });
      // const current_user = await Agent.findById({ _id: req.agent._id });
      // if (agent.contact != current_user.contact) return res.status(400).send({ error: true, message: "you can only access your account", data: {}, success: false });

      try {
            const reservations = await Reservation.find({ agent_id: req.agent._id, confirmed: false }).populate('hall_id').populate('organizer_id').populate('agent_id')
            return res.status(200).json({ error: false, success: true, data: reservations, message: "success", });
            
      } catch (error) {
            console({ pendingError: error })
            return res.status(400).json({ error: error, success: false, data: {}, message: "couldn't fetch pending reservations list" })
      }
})

// Get validated Reservation 
Router.get("/validated-reservations", verifyToken, async (req, res) => {
      // const agent = await Agent.findOne({ contact: contact });
      // const current_user = await Agent.findById({ _id: req.agent._id });
      // if (agent.contact != current_user.contact) return res.status(400).send({ error: true, success: false, data: {}, message: "you can only access your account" });

      try {
            await Reservation.find({ agent_id: req.agent._id, confirmed: true }).populate('hall_id').populate('organizer_id').populate('agent_id').then(reservations => {
                  console.log({ validatedReservation: reservations })
                  return res.status(200).json({ error: false, success: true, data: reservations, message: "confirmed" });
            })
      } catch (error) {
            console.log({ validatedError: error })
            return res.status(400).send({ error: error, success: false, data: {}, message: "could not fetch confirmed reservatrion" })
      }
})


// get all reservations
Router.get("/reservations", verifyToken, async (req, res) => {
      const agent = await Agent.findOne({ contact: contact });
      const current_user = await Agent.findById(req.agent._id);
      if (agent.contact != current_user.contact) return res.status(400).send({ error: true, success: false, data: {}, message: "you can only access your account" });

      try {
            await Reservation.find({}).then(reservations => {
                  return res.status(200).json({ error: false, success: true, data: reservations, message: "reservations list", });
            })
      } catch (error) {
            return res.status(400).send({ error: error, success: false, data: {}, message: "couldn't fetch list of reservations" });
      }
})

// Validate reservation
Router.patch("/validate-reservation/:hall_id", verifyToken, async (req, res) => {
      // const { date, event, contact } = req.body;
      try {
            // update hall collection
            const gottenReservation = await Reservation.findById(req.body.reservation_id);
            if (!gottenReservation) console.log({ error: 'reservation ressource inexistent' }, req.params.hall_id)
            if (!gottenReservation) return res.status(400).json({ error: true, success: false, data: {}, message: "the reservation your trying to validate isn't found" })

            // update reservation colleciton
            const reservation = await Reservation.findOneAndUpdate({ hall_id: req.params.hall_id, confirmed: false }, { $set: { confirmed: true } }).populate("hall_id").populate("organizer_id");
            console.log({ reservationAfterUpdate: reservation })

            const newReservation = await Reservation.findById(reservation._id);
            console.log({ reservationAfterUpdate222: newReservation })
            //update hall collection
            const hall = await Hall.findByIdAndUpdate(req.params.hall_id, {
                  $push: {
                        reservations: newReservation._id
                  }
            })

            // console.log({hall: hall});
            // update organizer collection
            // const organizer = await Organizer.findByIdAndUpdate(reservation.organizer_id, { $push: { reservations: newReservation } });
            // console.log({ oranizerAfterUpdate: organizer })
            return res.status(200).json({ error: true, success: false, data: { reservation: newReservation }, message: "reservation confirmed" })

      } catch (error) {
            console.log({ validatinError: error })
            return res.status(400).send({ error: error, success: false, data: {}, message: "an error occurred" });
      }

})

// cancel reservation
Router.delete("/cancel-reservation/:reservation_id", verifyToken, async (req, res) => {
      try {
            let reservation = await Reservation.findById(req.params.reservation_id);
            if (!reservation) return res.status(400).json({ error: true, success: false, data: {}, message: " no reservation found" });
            // remove date from hall agenda
            await Organizer.findByIdAndUpdate(reservation.organizer_id, { $pull: { reservations: reservation._id } });
            await Reservation.deleteOne({ _id: req.params.reservation_id }).populate("hall_id").populate("organizer_id");

            res.status(204).json({ error: false, success: true, data: {}, message: "reservation canceled successfully" });
      } catch (error) {
            res.status(400).json({ error: error, success: false, data: {}, message: "could not cancel the reservation" });
      }
})

module.exports = Router;