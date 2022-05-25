const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
      name: {
            type: String,
            required: true
      },
      capacity: {
            type: Number,
            required: true
      },
      contact:{
            type: Number,
            ref: "Agent"
      },
      agent: {
            type: Schema.Types.ObjectId,
            ref: "Agent"
      },
      picture: {
            type: String
      },
      reservations: [{
            type: Schema.Types.ObjectId,
            ref: "Reservation"
      }],
      location: {
            type: String,
            required: true
      },
      price: {
            type: Number,
            required: true
      }

}, {timestamps: true})

const Hall = mongoose.model("Hall", schema);

module.exports = Hall;