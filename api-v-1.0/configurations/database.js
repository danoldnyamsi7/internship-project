const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const db_conn = ()=>{
      try {
            const conn = mongoose.connect(process.env.MONGO_URI);
            // const conn = mongoose.connect("mongodb://localhost:27017");
            const db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error: "));
            db.once("open", function () {
              console.log("Connected successfully");
            });
            
      } catch (error) {
            console.error(error);
      }
      
}

module.exports = {
      db_conn
}

