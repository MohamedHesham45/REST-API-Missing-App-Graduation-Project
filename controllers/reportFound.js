const AppError = require('../utils/appError');
const reportFound=require('../models/missingPersonF')
const catchAsync=require('../utils/catchAsync')
const multer=require("multer")
const cloud = require('../cloudinary')

const multerStorage = multer.diskStorage({
  destination: 'public/img/personM',
  filename : async(req,file,cb)=>{
    fileName=file.filename = `person-${req.user.id}-${Date.now()}.jpeg`
  cb(null,fileName)
  }
})
const multerFilter = (req, file, cb) => {
  if(!file)
  cb(null,false)
  else
  cb(null, true);

};

   const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  });
  
      
exports.uploadPersonPhoto = upload.single('photo');


exports.uploadData=catchAsync(async(req,res,next)=>{
    if(!req.file)return next(new AppError(req.t('photoReq'),400))
    const currentUser=req.user._id
    const result = await cloud.uploads(req.file.path)
    
const PersonM=await reportFound.create({
    currentUser:currentUser,
    Name:req.body.Name,
    fatherName:req.body.fatherName,
    motherName:req.body.motherName,
    yearOfBirth:req.body.yearOfBirth,
    gender:req.body.gender,
    nationality:req.body.nationality,
    height:req.body.height,
    weight:req.body.weight,
    characteristics:req.body.characteristics,
    photo:result.url,
    date:req.body.date,
    country:req.body.country,
    state:req.body.state,
    city:req.body.city,
    circumstances:req.body.circumstances,
    phone:req.body.phone,
    whatsApp:req.body.whatApp,
    messangerUserName:req.body.messangerUserName,
    caseN:Date.now(),
    latitude:req.body.latitude,
    longitude:req.body.longitude
})

    
     res.status(201).json({
         status:"success",
         message:req.t('upleadData'),
         data: PersonM
        
     })

    }
    
)


exports.getData=catchAsync(async(req,res,next)=>{
  let personM={}
  const obj=req.query
     Object.keys(obj).forEach(key => {
         if (obj[key] === '') {
           delete obj[key];
         }
       });
  if(obj.gender==="male" || obj.gender==="female"){
      if(!obj.Name===true){
        personM=await reportFound.find({$and:[{Accept:true},{gender:obj.gender},{$and:[{yearOfBirth: {$lte:new Date().getFullYear()-Number(obj.minAge)}},{yearOfBirth: {$gte:new Date().getFullYear()-Number(obj.maxAge)}}]} ,{$and:[{height:{$gte:Number(obj.minheight)}},{height:{$lte:Number(obj.maxheight)}}]},{$and:[{weight:{$gt:Number(obj.minweight)}},{weight:{$lt:Number(obj.maxweight)}}]}]}).sort({caseN:-1})
      if(personM.length===0)return next( new AppError(req.t('noFound'),404))
      }
      if(!obj.Name===false){
        personM=await reportFound.find({$and:[{Accept:true},{gender:obj.gender},{Name:new RegExp(obj.Name,'i')},{$and:[{yearOfBirth: {$lte:new Date().getFullYear()-Number(obj.minAge)}},{yearOfBirth: {$gte:new Date().getFullYear()-Number(obj.maxAge)}}]} ,{$and:[{height:{$gte:Number(obj.minheight)}},{height:{$lte:Number(obj.maxheight)}}]},{$and:[{weight:{$gt:Number(obj.minweight)}},{weight:{$lt:Number(obj.maxweight)}}]}]}).sort({caseN:-1})
        if(personM.length===0)return next( new AppError(req.t('noFound'),404))
      }
      
    }
  if(Object.keys(obj).length===0){
    personM=await reportFound.find({Accept:true}).sort({caseN:-1})
    if(personM.length===0)return next( new AppError(req.t('noFound'),404))
  }
    res.status(200).json({
    status:"success",
    message:'no message',
    data:personM
      
    })
})
exports.getFUllDataByTheSameUser=catchAsync(async(req,res,next)=>{
  
    const currentUser=req.user._id
    const personM=await reportFound.find({currentUser:currentUser}).sort({
        caseN:-1     
    })
    res.status(200).json({
        status:"success",
        message:'no message',
        data:personM
    })
})
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj; 
  };
exports.updateDataofuser=catchAsync(async(req,res,next)=>{
  
  const filteredBody = filterObj(req.body,'Name',
  'fatherName',
  'motherName',
  'yearOfBirth',
  'gender',
  'nationality',
  'height',
  'weight',
  'characteristics',
  'date',
  'country',
  'state',
  'city',
  'circumstances',
  'phone',
  'whatsApp',
  'messangerUserName',
  'latitude',
  'longitude'
  );
  if (req.file) {
    const result = await cloud.uploads(req.file.path)
    filteredBody.photo = result.url;
}
  const updatedUserPerson = await reportFound.findOneAndUpdate({ currentUser:req.user.id , _id:req.params.idMissingF }, filteredBody, {
    new: true,
    runValidators: true
 
  }
  ); 
  if(!updatedUserPerson) return next(new AppError(req.t('noFound'), 404));
  res.status(200).json({
    status: 'success', 
    message:req.t('updateCase'),
    data :updatedUserPerson,
   
  });
})
exports.deleteData=catchAsync(async(req,res,next)=>{
    const currentUser=req.user._id
    const personM=await reportFound.findOneAndDelete({currentUser:currentUser,
    _id:req.params.idMissingF})
if(!personM){
    return next( new AppError(req.t('noFound'),404))
}

    res.status(200).json({
        status:"success",
        message:req.t('deleteCase'),
        data:personM

    })
})
exports.searchData=catchAsync(async(req,res,next)=>{
 const obj=req.query
    Object.keys(obj).forEach(key => {
        if (obj[key] === '') {
          delete obj[key];
        }
      });
   
    
    const personM=await reportFound.find({$and:[{Accept:true},obj]})  
    res.status(200).json({
        status:"success",
        message:'no message',
        data:personM
    })
 
})

