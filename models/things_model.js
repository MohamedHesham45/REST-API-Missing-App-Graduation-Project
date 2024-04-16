const mongoose = require('mongoose');

const thingsSchema = new mongoose.Schema({
    name: {
      type: String,
      required:[true,'name']
    },
    type: {
      type: String,
      required: [true, 'type']
    },
    state:{
      type: String,
      required: [true, 'state2']
    },
    model: {
      type: String,
      required: [true, 'model'],
    },
    color: {
      type: String,
      required: [true, 'color'],
      },
    car_number:String,
    description:String,
    photo:String,
    date: {
      type: Date,
      required: [true, 'date'],
      },
     location: {
      type: String,
      required: [true, 'location'],
      },
     phone: {
      type: String,
      required: [true, 'phone'],
      },
    whatsNamber:String,
    messengerUserName:String,
    userID:String, 
    Accept:{
      type:Boolean,
      default:false
    },
    castDate:Date, 
    latitude:String,
    longitude:String,   
    
  });
  const Things = mongoose.model('things', thingsSchema);

  module.exports = Things;