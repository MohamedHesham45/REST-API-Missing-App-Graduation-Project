const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const Things = require('../models/things_model');
const cloud = require('../cloudinary')

const conter=require('../models/conter')

const multerStorage = multer.diskStorage({
  destination: 'public/img/things',
  filename : async(req,file,cb)=>{
    fileName=file.filename = `things-${req.user.id}-${Date.now()}.jpeg`
  cb(null,fileName)
  }
})
const multerFilter = (req, file, cb) => {

  cb(null, true);

};
   const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  });
  
      
exports.uploadThingsPhoto = upload.single('photo');

exports.uploadNewThings =catchAsync( async (req, res, next) => { 
    if(!req.file)return next(new AppError(req.t('photoReq'),400))
    const result = await cloud.uploads(req.file.path)
    const newThings = await Things.create({
      name: req.body.name,
      type: req.body.type,
      state:req.body.state,
      car_number:req.body.car_number,
      photo:result.url,
      location: req.body.location,
      color: req.body.color,
      description:req.body.description,
      phone:req.body.phone,
      date:req.body.date,
      model:req.body.model,
      whatsNamber:req.body.whatsNamber,
      messengerUserName:req.body.messengerUserName,
      userID:req.user.id,
      castDate:Date.now(),
      latitude:req.body.latitude,
      longitude:req.body.longitude
    });
    res.status(201).json({
        status:"success",
        message:req.t('upleadData'),
        data:newThings  
        
      });
});
exports.getAllThings=catchAsync( async (req, res, next) => { 
  const obj=req.query
     Object.keys(obj).forEach(key => {
         if (obj[key] === '') {
           delete obj[key];
         }
       });  
     const things=await Things.find({$and:[{Accept:true},obj]}).sort({castDate:-1})
   if(things.length==0)return next(new AppError(req.t('noFound'),404))
   
     res.status(200).json({
         status:"success",
         message:null,
         data:things
     })
  
  });

exports.getThingsForUser=catchAsync( async (req, res, next) => { 
  const tingsAllForUser= await Things.find({userID:req.user.id}).sort({castDate:-1});
  res.status(200).json({ 
    status:"success",
    message:null,
    data:tingsAllForUser
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj; 
};

exports.updateUserThings = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'type','location','color','description','phone','date','model','whatsNamber','messengerUserName','car_number','state','latitude',
  'longitude');
  if (req.file) {
    const result = await cloud.uploads(req.file.path)
    filteredBody.photo = result.url;
}  
  const updatedUserThings = await Things.findOneAndUpdate({userID:req.user.id , _id:req.params.thingsID }, filteredBody, {
    new: true,
    runValidators: true
  }); 
  if(updatedUserThings.length==0) return next(new AppError('No thing to update ', 404));
  res.status(200).json({
    status: 'success', 
    message:req.t('updateCase'),
    user: updatedUserThings,
   
  });
});


exports.deleteThingsForUser= catchAsync(async (req, res, next) => {
  const thing= await Things.findOneAndDelete({userID:req.user.id , _id:req.params.thingsID }); 
  if(!thing) return next(new AppError(req.t('noFound'), 404));
  res.status(200).json({
    status: 'success',
    message:req.t('deleteCase'),
    data: null 
  });
});

exports.search=catchAsync(async(req,res,next)=>{
  const obj=req.query
     Object.keys(obj).forEach(key => {
         if (obj[key] === '') {
           delete obj[key];
         }
       });  
     const things=await Things.find({$and:[{Accept:true},obj]})
   if(things.length==0)return next(new AppError(req.t('noFound'),404))
   
     res.status(200).json({
         status:"success",
         message:null,
         data:things
     })
  
 })

 exports.conterFoundThings=catchAsync(async(req,res,next)=>{
  const thing= await Things.findOneAndDelete({userID:req.user.id , _id:req.params.thingsID }); 
  if(!thing) return next(new AppError(req.t('noFound'), 404));
const Found=await conter.findById('62667a1cbdca70cb13107c48')
 Found.thingsFound=Found.thingsFound+1
 await Found.save()
  res.status(200).json({
      status:"success",
      message:req.t('deleteCase'),
      data:Found

  })
})