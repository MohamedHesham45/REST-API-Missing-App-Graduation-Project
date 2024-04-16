const mongoose=require("mongoose")


const conterSchema=mongoose.Schema({
    personFound:Number,
    thingsFound:Number
         
})

const conter=mongoose.model("Found",conterSchema);
module.exports=conter;