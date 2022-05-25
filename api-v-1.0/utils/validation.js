
const joi = require("joi");

const validateOrganizer = (organizer)=>{
      const schema = joi.object({
            contact: joi.number().required(),
            password: joi.string().required(),
            event: joi.array(),
            reservations: joi.string()
      })

      return schema.validate(organizer);
}

const validateOrganizerUpdate = (organizer)=>{
      const schema = joi.object({
            contact: joi.number().required()
      })
      return schema.validate(organizer)
}

const validateOrganizerLogin = (organizer)=>{
      const schema = joi.object({
            contact: joi.number().required(),
            password: joi.string().required(),
      })

      return schema.validate(organizer)
}

const validatePwd = (pwd)=>{
      const schema = joi.object({
            password: joi.string().required(),
            contact: joi.number().required()
      })

      return schema.validate(pwd);
}

const validateAgent = (agent)=>{

      const schema = joi.object({
            name: joi.string().default("Agent").max(30).min(4),
            contact: joi.any().required(),
            password: joi.string().required(),
            halls: joi.array(),
            picture: joi.string(),
      })

      return schema.validate(agent);
}

const validateAgentLogin = (creds)=>{
      const schema = joi.object({
            contact: joi.number().required(),
            password: joi.string().required(),
      })

      return schema.validate(creds);
}

const validateHall = (hall)=>{
      const schema = joi.object({
            name: joi.string().required(),
            capacity: joi.number().required(),
            contact: joi.number(),
            agent: joi.string(),
            picture: joi.string(),
            reservations: joi.array(),
            location: joi.string().required(),
            price: joi.number().required(),
          
      })

      return schema.validate(hall);
}

const validateReservation = (reservation)=>{
      const schema = joi.object({
            event: joi.string().required(),
            date: joi.string().required(),
            bargain_price: joi.number(),
            confirmed: joi.boolean(),
            // agent_id: joi.string(),
            // organizer_id: joi.string()
      })
      return schema.validate(reservation);
}

module.exports = {
      validateAgent,
      validateAgentLogin,
      validateHall,
      validateOrganizer,
      validatePwd,
      validateOrganizerLogin,
      validateReservation,
      validateOrganizerUpdate
}