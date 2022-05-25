const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
      hall_id: {
            type: Schema.Types.ObjectId,
            ref: 'Hall',
            required: true
      },
      bargain_price: {
            type: Number
      },
      event: {
            type: String,
            required: true
      },
      date: {
            type: String,
            required: true
      },
      confirmed: {
            type: Boolean,
            default: false
      },
      organizer_id: {
            type: Schema.Types.ObjectId,
            ref: "Organizer"
      },
      agent_id: {
            type: Schema.Types.ObjectId,
            ref: "Agent"
      }

}, { timestamps: true })

const Reservation = mongoose.model("Reservation", schema);

module.exports = Reservation
