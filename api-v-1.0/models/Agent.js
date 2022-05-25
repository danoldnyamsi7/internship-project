const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schema = new Schema({
      name: {
            type: String,
            default: "Agent"
      },
      contact: {
            type:Number,
            required: true
      },
      password: {
            type: String,
            required: true
      },
      halls: [
            {
                  type: Schema.Types.ObjectId,
                  ref: 'Hall'
            }
      ],

      picture: {
            type: String,
            // required: false
      }

}, { timestamps: true })

const Agent = mongoose.model('Agent', schema);
module.exports = Agent;