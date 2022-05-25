require("dotenv").config();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
});


// function uploads(file, config, folder){
//       return new Promise(resolve=>{
//             cloudinary.uploader.upload(file, config, (result)=>{
//                   resolve({
//                         url: result.url,
//                         id: result.public_id
//                   })
//             }), {
//                   ressource_type: "auto",
//                   folder: folder
//             }
//       })
// }

module.exports = {
      cloudinary
}