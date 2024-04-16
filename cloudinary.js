const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name : process.env.ClOUD_NAME,
    api_key : process.env.Api_key,
    api_secret: process.env.Api_secret
})

exports.uploads = (file) =>{
    return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) =>{
    resolve({url: result.url, id: result.public_id})
    }, {resource_type: "auto"})
    })
}