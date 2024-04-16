
const catchAsync = require('../utils/catchAsync');
const Things = require('../models/things_model');
const person=require('../models/missingPerson');
const personF=require('../models/missingPersonF');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/email');
const User = require('./../models/users');


//things
exports.adminAcceptThings=catchAsync(async(req,res,next)=>{
    const obj={ Accept: 'true' }
    const acceptThing = await Things.findById(req.params.thingsID)
    if(!acceptThing)return next(new AppError(req.t('noFound'),400))
    if(acceptThing.Accept===true)return next(new AppError(req.t('acceptCase'),400))  
   const acceptThings = await Things.findByIdAndUpdate(req.params.thingsID ,obj,{
     new: true,
     runValidators: true
     
   }); 
   if(!acceptThings)return next(req.t('noFound'),400)
   
   
   res.status(200).json({
     status: 'success',
     message:req.t('acceptCase'),
     data: acceptThings 
   });
 })
 
 
 exports.adminRejectThings=catchAsync(async(req,res,next)=>{
   const Thing = await Things.findById(req.params.thingsID )
   if(!Thing)return next(new AppError(req.t('noFound'),400))
 
   const user =await User.findById(Thing.userID )
   await sendEmail({
     name:user.name,
     email:user.email,
     message:req.body.message,
     subject: req.t('resonofreject'),
     fromWhat:'admin'
   });
 
   res.status(200).json({
     status: 'success',
     message: req.t('rejectCase'),
     data:null
   });
 
 })
 
 exports.getAllThingsAdmin=catchAsync( async (req, res, next) => { 
  const obj=req.query
  Object.keys(obj).forEach(key => {
      if (obj[key] === '') {
        delete obj[key];
      }
    });
    
     if(obj.Accept==='false'||Object.keys(obj).length===0){
     const thingsAll= await Things.find(obj) .sort({castDate:-1});
     
     res.status(200).json({ 
       status:"success",
       message:null,
       data:thingsAll
     });
   }
   else return next(new AppError(req.t('queryIncorrect'), 400));
 });
 
 exports.deleteThingsAdmin= catchAsync(async (req, res, next) => {
   const thing= await Things.findByIdAndDelete(req.params.thingsID ); 
   if(!thing) return next(new AppError(req.t('noFound'), 400));
   res.status(200).json({
     status: 'success',
     message:req.t('deleteCase'),
     data: null 
   });
 });
 

 //person
 exports.adminAcceptPerson=catchAsync(async(req,res,next)=>{
  const obj={ Accept: 'true' }
  const acceptPerson = await person.findById(req.params.PersonID)
  if(!acceptPerson)return next(new AppError(req.t('noFound'),400))
  if(acceptPerson.Accept===true)return next(new AppError(req.t('acceptCase'),400))  
 const acceptperson = await person.findByIdAndUpdate(req.params.PersonID ,obj,{
   new: true,
   runValidators: true
   
 }); 
 if(!acceptperson)return next(new AppError(req.t('noFound'),400))
 
 
 res.status(200).json({
   status: 'success',
   message:req.t('acceptCase'),
   data: acceptperson 
 });
})


exports.adminRejectPerson=catchAsync(async(req,res,next)=>{
 const Person = await person.findById(req.params.PersonID )
 if(!Person)return next(new AppError(req.t('noFound'),400))

 const user =await User.findById(Person.currentUser )
 await sendEmail({
   name:user.name,
   email:user.email,
   message:req.body.message,
   subject:  req.t('resonofreject'),
   fromWhat:'admin'
 });

 res.status(200).json({
   status: 'success',
   message: req.t('rejectCase'),
   data:null
 });

})

exports.getAllPersonAdmin=catchAsync( async (req, res, next) => { 
  const obj=req.query
  Object.keys(obj).forEach(key => {
      if (obj[key] === '') {
        delete obj[key];
      }
    });
  
   if(obj.Accept==='false'||Object.keys(obj).length===0){
   const Person= await person.find(obj) .sort({caseN:-1});
   
   res.status(200).json({ 
     status:"success",
     message:null,
     data:Person
   });
 }
 else return next(new AppError(req.t('queryIncorrect'), 400));
});

exports.deletePersonAdmin= catchAsync(async (req, res, next) => {
 const Person= await person.findByIdAndDelete(req.params.PersonID ); 
 if(!Person) return next(new AppError(req.t('noFound'), 400));
 res.status(200).json({
   status: 'success',
   message:req.t('deleteCase'),
   data: null 
 });
});
//personF
exports.adminAcceptPersonF=catchAsync(async(req,res,next)=>{
  const obj={ Accept: 'true' }
  const acceptPersonF = await personF.findById(req.params.PersonID)
  if(!acceptPersonF)return next(new AppError(req.t('noFound'),400))
  if(acceptPersonF.Accept===true)return next(new AppError(req.t('acceptCase'),400))  
 const acceptpersonF = await personF.findByIdAndUpdate(req.params.PersonID ,obj,{
   new: true,
   runValidators: true
   
 }); 
 
 
 
 res.status(200).json({
   status: 'success',
   message:req.t('acceptCase'),
   data: acceptpersonF 
 });
})


exports.adminRejectPersonF=catchAsync(async(req,res,next)=>{
 const PersonF = await personF.findById(req.params.PersonID )
 if(!PersonF)return next(new AppError(req.t('noFound'),400))

 const user =await User.findById(PersonF.currentUser )
 await sendEmail({
   name:user.name,
   email:user.email,
   message:req.body.message,
   subject: req.t('resonofreject'),
   fromWhat:'admin'
 });

 res.status(200).json({
   status: 'success',
   message: req.t('rejectCase'),
   data:null
 });

})

exports.getAllPersonFAdmin=catchAsync( async (req, res, next) => { 
  const obj=req.query
  Object.keys(obj).forEach(key => {
      if (obj[key] === '') {
        delete obj[key];
      }
    });
  
   if(obj.Accept==='false'||Object.keys(obj).length===0){
   const PersonF= await personF.find(obj) .sort({caseN:-1});
   
   res.status(200).json({ 
     status:"success",
     message:null,
     data:PersonF
   });
 }
 else return next(new AppError(req.t('queryIncorrect'), 400));
});

exports.deletePersonFAdmin= catchAsync(async (req, res, next) => {
 const PersonF= await personF.findByIdAndDelete(req.params.PersonID ); 
 if(!PersonF) return next(new AppError(req.t('noFound'), 400));
 res.status(200).json({
   status: 'success',
   message:req.t('deleteCase'),
   data: null 
 });
});