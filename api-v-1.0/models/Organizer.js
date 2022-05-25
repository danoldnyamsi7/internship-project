const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
      contact: {
            type: Number,
            required: true
      },
      password: {
            type: String,
            required: true
      },
      reservations: [{
            type: Schema.Types.ObjectId,
            ref: "Reservation"
      }]
}, { timestamps: true })

const Organizer = mongoose.model("Organizer", schema);

module.exports = Organizer;