const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
      const access_token = req.header("access_token");
      if (!access_token) return res.status(401).send({error: true, success: false, data:{}, message: "Unauthoprized access" });

      try {
            const isValidToken = jwt.verify(access_token, process.env.ACCESS_TOKEN);
            req.agent = isValidToken;
            // console.log(req.agent);
            next();
      } catch (error) {
            return res.status(400).send({ message: "Invalid token" });
      }
}

const isAuthzOrganizer = (req, res, next) => {
      const oaccessToken = req.header("oaccess_token");
      if(!oaccessToken) console.log("oaccess-token not found boy")
      if (!oaccessToken) return res.status(401).json({error:true, succes: true, data: {}, message: "Unauthorized access" });

      try {
            const isValidOrg = jwt.verify(oaccessToken, process.env.OACCESS_TOKEN);
            req.organizer = isValidOrg;
            next();
      } catch (error) {
            return res.status(400).json({error:error, success: true, data: {}, message: "Invalid token" });
      }
}

module.exports = {
      verifyToken,
      isAuthzOrganizer
}