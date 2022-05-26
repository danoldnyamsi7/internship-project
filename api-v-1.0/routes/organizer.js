const Router = require("express").Router();
const Organizer = require("../models/Organizer");
const Reservation = require("../models/Reservation");
const Hall = require("../models/Hall");
const { validateOrganizer, validateOrganizerLogin, validateOrganizerUpdate } = require("../utils/validation");
const { isAuthzOrganizer } = require("../utils/verify_token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup
Router.post('/signup', async (req, res) => {
      console.log(req.body)
      const { error } = validateOrganizer(req.body);
      console.log(error)
      if (error) return res.status(400).send({ message: error.details[0].message, success: false, data: {}, error: true });
      const organizer = await Organizer.findOne({ contact: req.body.contact });
      if (organizer) return res.status(400).send({ error: true, success: false, data: {}, message: "account already exists" })
      const { password } = req.body;
      let salt = await bcrypt.genSalt(10);
      let hash_pwd = await bcrypt.hash(password, salt);

      try {

            const organizer = Organizer.create({
                  contact: req.body.contact,
                  password: hash_pwd,
            })

            return res.status(201).json({ error: false, success: true, data: organizer, message: "account created" });

      } catch (error) {
            console.log({ orgErr: error })
            return res.status(400).json({ error: error, success: false, data: {}, message: "couldn't signin try again" });
      }



})

// signin
Router.post('/signin', async (req, res) => {
      // validation 
      console.log(req.body)
      const { error } = validateOrganizerLogin(req.body);
      if(error) console.log(error.details[0].message)
      if (error) return res.status(400).send({ error: true, success: false, data: {}, message: error.details[0].message });

      // verification
      const { contact, password } = req.body;
      const organizer = await Organizer.findOne({ contact: contact });
      if (!organizer) return res.status(400).json({ error: error, success: false, data: {}, message: "Account doesnt't exists" });
      const isPassword = await bcrypt.compare(password, organizer.password);
      if (!isPassword) return res.status(400).json({ error: true, success: false, data: {}, message: "invalid password, please try again" });


      // create an access token
      try {
            const oaccess_token = jwt.sign({ _id: organizer._id }, process.env.OACCESS_TOKEN, { expiresIn: "30d" });
            return res.header("oaccess_token", oaccess_token).json({ organizer: organizer, token: oaccess_token });

      } catch (error) {
            return res.status(400).send({ error: error, success: false, data: {}, message: error });
      }

})

// for auth think about protected and protected2 good night bro!

// get profile
Router.get('/profile', isAuthzOrganizer, async (req, res) => {
      const current_user = await Organizer.findById(req.organizer._id).populate('reservations');
      if (!current_user.contact) return res.status(400).json({ error: true, success: true, data: {}, message: "you can only access your account" });
      return res.status(200).json({ error: false, success: true, data: current_user, message: " organizer profile" });
})

// logout 
Router.get("/logout", isAuthzOrganizer, async (req, res) => {
      let token = req.header("oaccess_token");
      token = req.header("oaccess_token", " ");
      return res.header("oaccess_token", token).send({ error: error, success: false, data: token, message: "user logged out" });
})

// update profile
Router.patch("/update-profile", isAuthzOrganizer, async (req, res) => {
      const { error } = validateOrganizerUpdate(req.body);
      if (error) return res.status(400).send({ error: error.details[0].message });
      const current_user = await Organizer.findById(req.organizer._id);
      if (!current_user.contact) return res.status(400).send({ error: true, success: false, data: {}, message: "you can only access your account" });

      try {
            const update = await Organizer.findByIdAndUpdate(req.organizer._id, {
                  contact: req.body.contact,
            });

            const updated = await Organizer.findById(update._id).populate("reservations");

            return res.status(200).json({ error: false, success: true, data: updated, message: "password updated" });

      } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "could not update profile" });
      }


})

// change password
Router.patch("/change-password", isAuthzOrganizer, async (req, res) => {


      const { contact } = req.body;
      const organizer = await Organizer.findOne({ contact: contact });
      const current_user = await Organizer.findById(req.organizer._id);
      if (organizer.contact != current_user.contact) return res.status(400).send({ error: true, success: false, data: {}, message: "you can only access your account" });

      const new_pwd = req.body.password;
      let salt = await bcrypt.genSalt(10);
      let hash_pwd = await bcrypt.hash(new_pwd, salt);

      try {

            await Organizer.findByIdAndUpdate({ _id: req.organizer._id }, { password: hash_pwd }).then(organizer => {
                  return res.status(200).json({ error: false, success: true, data: organizer, message: 'password reset' })
            });
      } catch (error) {
            return res.status(400).send({ error: error, success: false, data: {}, message: "couldn't update user password please try again" });
      }


})

// delete profile
Router.delete('/delete-account', isAuthzOrganizer, async (req, res) => {
      const { contact, password } = req.body;
      const organizer = await Organizer.findOne({ contact: contact });
      const current_user = await Agent.findById(req.organizer._id);
      if (organizer.contact != current_user.contact) return res.status(400).send({ error: true, success: false, data: {}, message: "you can only access your account" });

      try {
            await Organizer.findByIdAndDelete(req.organizer._id).populate("reservation");
            return res.status(204).json({ error: false, success: false, data: {}, message: "Agent deleted success!" });
      } catch (error) {
            return res.status(400).send({ error: error, success: false, data: {}, message: "couldn not delete the user account", });
      }
})

// agenda, events
Router.get("/reservations-list", isAuthzOrganizer, async (req, res) => {
      /*
            to have agenda of an organizer is to have a list of reservations he made
            so if we can check in the collection of reservations the :id of the current 
            organizer and return it.

            Or we can add a reservation property to the organizer schema that is of type [ObjectId]
             from the :reservation_id query the reservation collection to obtain a list related to the
             organizer
      */
      try {
            const organizer = await Organizer.findById(req.organizer._id);
            const reservationList = await Reservation.find({ organizer_id: organizer._id }).populate("hall_id").populate("agent_id").populate("organizer_id");
            // const reservation_list = organizer.reservations.map(async reservation_id => {
            //       let reservation = await Reservation.findById(reservation_id).populate("organizer_id");
            //       return reservation;
            // })
            console.log(reservationList)
            return res.status(200).json({ error: false, success: true, data: reservationList, message: "organizer agenda" });
            // if (reservation_list.length === 0) return res.json({ error: false, success: true, data: reservation_list, message: "no reservations made yet" });
      } catch (error) {
            return res.status(400).send({ error: error, success: false, data: {}, message: "could not retrieve reservation list" })
      }


})


// update Reservation
Router.patch("/update-reservation/:reservation_id", isAuthzOrganizer, async (req, res) => {
      console.log({body: req.body});
      const current_organizer = await Organizer.findById(req.organizer._id);
      if (!current_organizer) console.log({ fetchError: error });
      if (!current_organizer) return res.status(400).json({ error: false, success: false, data: {}, message: "Organizer doesn't exist" });

      try {



            const reservation = await Reservation.findByIdAndUpdate(req.params.reservation_id, req.body).populate("organizer_id").populate("hall_id").populate("agent_id");

            const updatedReservation = await Reservation.findById(reservation._id).populate("organizer_id").populate("hall_id");
            console.warn({ updateHall: updatedReservation });
            if (!updatedReservation) return res.status(400).json({ error: true, success: false, data: {}, message: "couldn't get updated reservation" })

            res.status(200).json({ error: false, success: true, data: updatedReservation, message: "reservation and hall updated" })

      } catch (error) {
            console.log({ error: error })
            res.status(400).json({ error: true, success: false, data: {}, message: error })
      }

})

// cancel reservation

/*
      in order for the organizer to cancel an event, there are two scaenaios.
      1. the event is pending that is it is in the reservation collection but
      in a pending state.
      2. the event is in a confirmed state in the reservation collection.

      so in order to cancel a reservation we can

      1. remove it in the reservation collection when it is in pending state
      and update the hall agent collection by pulling out the hall agenda
*/
// delete reservation
Router.delete("/cancel-reservation/:reservation_id", isAuthzOrganizer, async (req, res) => {
      const reservation = await Reservation.findById(req.params.reservation_id);
      if (!reservation) return res.status(400).json({ error: true, success: false, data: {}, message: "ressource doesn't exist anymore" })
      try {
            // update my reservation proprety
            // await Organizer.findByIdAndUpdate(req.organizer._id, { $pull: { reservation: reservation } }).populate("reservation")

            // // update my events proprety
            // await Organizer.findByIdAndUpdate(req.organizer._id, {$pull: {event: reservation}});

            // // update hall agenda
            // await Hall.findOneAndUpdate(req.organizer._id, {$pull: { agenda: reservation }});

            // // update reservation collection

            await Reservation.findByIdAndDelete(req.params.reservation_id);
            await Hall.findByIdAndUpdate(reservation.hall_id, {$pull: {
                  reservations: reservation._id
            }})

            await Organizer.findByIdAndUpdate(reservation.organizer_id, {$pull: {reservations: reservation._id}})
            return res.status(203).json({ error: false, success: true, data: {}, message: "reservation canceled and deleted, all collections updated" });

      } catch (error) {
            console.log({ delete: error })
            return res.status(400).send({ error: error.message, success: false, data: {}, message: "could not cancel the reservation" })
      }

});
module.exports = Router;