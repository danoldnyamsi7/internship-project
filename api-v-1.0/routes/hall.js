const Router = require("express").Router();
const fs = require('fs');
const Axios = require("axios");
const { cloudinary } = require("../utils/cloudinary");
const Agent = require("../models/Agent");
const Hall = require("../models/Hall");
const Reservation = require("../models/Reservation");
const Organizer = require("../models/Organizer");
const { verifyToken, isAuthzOrganizer } = require("../utils/verify_token");
const { validateHall, validateReservation } = require("../utils/validation");

Router.post("/register", verifyToken, async (req, res) => {
      // validate user data
      // console.log(typeof(req.body.picture))
      const { error } = validateHall(req.body);
      console.log(error);
      // check if there's error
      if (error) return res.status(400).send({ error: true, success: false, data: {}, message: error.details[0].message });
      // check if hall already exists
      let hall = await Hall.findOne(req.body);
      if (hall) return res.status(400).json({ error: true, success: false, data: {}, message: "ressource already exists" });
      // convert image to base64 encoded
      const file = req.body.picture;
      const config = {
            upload_preset: "dev_setups_halls"
      }
      // upload file to cloudinary
      try {
            const uploadToCloudinary = await cloudinary.uploader.upload(file, config)
                  .then(result => {
                        const picture = result.url;
                        return picture;
                  })
            req.body.picture = uploadToCloudinary;
            // console.log({picNow: req.body.picture})
            try {

                  const agent = await Agent.findById(req.agent._id);

                  // console.log(agent, "agent")
                  const newHall = await Hall.create({
                        name: req.body.name,
                        location: req.body.location,
                        picture: req.body.picture,
                        capacity: req.body.capacity,
                        contact: agent.contact,
                        agent: agent._id,
                        price: req.body.price
                  });


                  const fetchHall = await Hall.findById(newHall._id);

                  // console.log(fetchHall, "new hall");
                  // update the agent's hall array
                  await Agent.findByIdAndUpdate(agent._id,
                        { $push: { halls: fetchHall._id } },
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                              // console.log({ afterUpdate: docs }); 
                              ).clone()
                  res.status(201).json({ error: false, success: true, data: newHall, message: "hall created successfuly" });

            } catch (error) {
                  console.log({ agentError: error });
            }

      } catch (error) {
            console.log(error);
            return res.status(400).json({ error: true, success: false, data: {}, message: error })
      }

})


/*
      (#) example to retreive ressources from cloudinary

      app.get("/api/images", async(req, res)=>{
            const { ressources } = await cloudinary.search.expression("folder:${folder where it is found}").sort_by("public_id", "desc").max_results(30).execute();
            (#NB: cloudinary search method includes
                  * searching by descriptive attributes such as public_id, filename, folders, tags, context, etc
                  * searhing by file details such as type, format, file size, dimensions, etc.
                  * searching by embedded data such as Exif, XMP, etc
                  * searching by analyzed data such as the number of faces, predominant colors, auto-tags.
                  * Requesting aggregation counts on specified parameters, for example the number of assets found broken
                  * down by file
                  * 
                  * by filename use .expression(filename="the filename" or filename: (file name(in case there is a space in the name)))) 
            const publicIds = ressources.map(file => file.public_id);
            res.json(publicIds) // this is an array of public ids (images in the folder in your cloud);

            now you go to your frontend and make a request to this route to get the public ids (when doing the http call using axios use a relative path since you have proxy your backend to your frontend so no need to say http://loacalhost:8002/ anymore you can just go ahead with /api/whatever);

            from that response you'll get the array of public_id. now,
            install cloudinary-react in your frontend then 

            return (
                  <div>
                        <h1 className="title"> Home</h1>
                        {imageIds && imageIds.map((imageId, index)=>(
                              <Image
                              key={index}
                              cloudName={yourCloudName} 
                              publicId={imageId} 
                              width={width} or custome-width 
                              crop="scale">
                        ))}
                  </div>
            )
      })
*/

// get agent hall
Router.get("/my-hall", verifyToken, async (req, res) => {
      const current_agent = await Agent.findById(req.agent._id);
      if (!current_agent) return res.status(400).send({ message: "Agent doesn't exist" });
      try {
            await Hall.findOne({ agent: current_agent._id }).populate("agent").then(hall => {
                  return res.status(200).json({ hall: hall });
            })
      } catch (error) {
            return res.status(400).send({ error: error });
      }

})

// custom research
// Router.get("/hall-research", async (req, res)=>{

//       try {
//             const results = await Hall.find(req.query);
//             if(results.length === 0) return res.status(200).json({ error: false, success: true, data: result, message: "no element found"});
//             return results;
//       } catch (error) {
//             return res.status(400).json({ error: error, success: false, data: {}, message:"could not search result"});
//       }
// })

// get * halls
Router.get("/", async (req, res) => {

      try {
            const halls = await Hall.find().populate("agent");
            return res.status(200).json({ error: false, success: true, data: halls, message: "success, list of halls" });
      } catch (error) {
            console.log({ fetchError: error });
            return res.status(400).json({ error: true, success: false, data: {}, message: "could not fetch the halls" });
      }

})

// get specific hall
Router.get("/hall/:hall_id", async (req, res) => {

      try {
            const hall = await Agent.findById(req.params.hall_id)
            return res.status(200).json({ error: false, succes: true, data: hall, message: "success" });
      } catch (error) {
            return res.status(400).json({ error: true, success: false, data: {}, message: `could not fetch the hall with id:${req.params.hall_id}` });
      }

})


// update agent hall
Router.patch("/update-hall/:hall_id", verifyToken, async (req, res) => {
      // console.log({hall_id: req.params.hall_id, body: req.body});
      const current_agent = await Agent.findById(req.agent._id);
      if (!current_agent) console.log({ fetchError: error });
      if (!current_agent) return res.status(400).json({ error: false, success: false, data: {}, message: "Agent doesn't exist" });

      const file = req.body.picture;
      const config = {
            upload_preset: "dev_setups_halls"
      }
      // upload file to cloudinary
      try {
            const uploadToCloudinary = await cloudinary.uploader.upload(file, config)
                  .then(result => {
                        const picture = result.url;
                        return picture;
                  })
            req.body.picture = uploadToCloudinary;
            // console.log({picNow: req.body.picture})

            const hall = await Hall.findOneAndUpdate({ agent: current_agent._id, _id: req.params.hall_id }, req.body)

            const updatedHall = await Hall.findById(hall._id);
            // console.log({updateHall: updatedHall});
            if (!updatedHall) return res.status(400).json({ error: true, success: false, data: {}, message: "couldn't get updated hall" })

            // update the agent.halls array, 
            res.status(200).json({ error: false, success: true, data: updatedHall, message: "agent and hall updated" })

      } catch (error) {
            console.log({ error: error })
            res.status(400).json({ error: true, success: false, data: {}, message: error })
      }
      // try {
      //      const hall= await Hall.findOneAndUpdate({ agent: current_agent._id, _id: req.params.hall_id }, req.body)

      //       const updatedHall = await Hall.findById(hall._id);
      //       console.log({updateHall: updatedHall});
      //       if(!updatedHall) return res.status(400).json({ error:true, success: false, data: {}, message:"couldn't get updated hall"})

      //       // update the agent.halls array, 
      //       const agent = await Agent.findByIdAndUpdate(req.agent._id, {
      //             $set:{
      //                   'halls.$.hall_id': updatedHall
      //             }
      //       });
      //       if(!agent) console.log({ fetchError: 'error from update agent' });
      //       if(!agent) return res.status(400).json({ error: true, success: false, data: {}, message:"the agent halls array wasn't updated "})
      //       res.status(200).json({ error:false, success: true, data: {agent:updatedAgent, hall: updatedHall}, message: "agent and hall updated"})

      // } catch (error) {
      //       return res.status(400).json({ error: error, success: false, data: {}, message: "could not update the hall" });
      // }

})

// delete agent hall
Router.delete("/delete-hall/:hall_id", verifyToken, async (req, res) => {
      const current_agent = await Agent.findById(req.agent._id);
      if (!current_agent) return res.status(400).send({ message: "Agent doesn't exist" });

      try {
            const toBeDeleted = await Hall.findById(req.params.hall_id);
            await Agent.findOneAndUpdate({ _id: toBeDeleted.agent._id }, { $pull: { halls: req.params.hall_id } });
            const hall = await Hall.findOneAndDelete({ agent: current_agent._id }, { _id: req.params.hall_id })
            
            await Reservation.findOneAndDelete({hall_id: req.params.hall_id});
            return res.status(200).json({ message: "hall and relationships have been deleted" });
      } catch (error) {
            console.log(error);
            return res.status(400).json({ error: error });
      }

})

// book Hall
Router.post("/book-hall/:hall_id", isAuthzOrganizer, async (req, res) => {

      // console.log({body_bookHall: req.body});
      const { error } = validateReservation(req.body);
      if (error) return res.status(400).json({ error: true, success: false, data: {}, message: error.details[0].message });
      const hall = await Hall.findById(req.params.hall_id);
      if (!hall) return res.status(400).json({ error: true, success: false, data: {}, message: "sorry bu the hall you want to reserve happends to be absent on our system" })
      // console.log({hall: hall});

      if (error) return console.log({ message: error.details[0].message });
      try {
            // const organizer = await Organizer.create({ contact: req.body.contact, event: req.body.event });
            const organizer = await Organizer.findById(req.organizer._id);

            Axios({
                  method: "POST",
                  url: `${process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/agent/notify-agent'}`,
                  data: {
                        hall_id: req.params.hall_id,
                        date: req.body.date,
                        bargain_price: req.body.bargain_price,
                        event: req.body.event,
                        organizer_id: organizer._id,
                  },
                  headers: {
                        "Content-Type": "application/json",

                  }
            }).then(async resp => {
                  const reservation = resp.data.data;
                  console.log({ reservation: reservation })

                  /* update the organizer's event's array an add the reservations obect into it with a
                  with a propery confirmed that is a boolean that is false by default and will be through only
                  when the organizer will validate the reservation */
                  // return
                  return res.status(200).json({ error: false, success: true, data: reservation, message: "a message has been sent to the hall agent, he will contact you for the deal" });

            }).catch(error => { console.log({ Error: error }); return res.json({ message: error }); });


      } catch (error) {
            console.log({ error: error })
            return res.status(400).send({ error: error, message: "couldn't collect the data" });
      }

      /*
      .book is to add a date in the agenda array of the hall that has been booked.
      .only hall agent has permision to do so.

      

      strategy.

      send book request to hall agent 
      agent updates the agenda 
      you get notify for it.
      */


})

// Router.get("/confirm-reservation-message", (req, res)=>{
//       // this route contains information about the reservation made by the client as well as informations about the hall owner
//       // the following information will be stored in the user account.
//       const { reservation } = req.body.data;

// })

module.exports = Router;