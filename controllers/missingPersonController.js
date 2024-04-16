const AppError = require('../utils/appError');
const PersonMissing=require('../models/missingPerson')
const catchAsync=require('../utils/catchAsync')
const multer=require("multer")
const reportFound=require('../models/missingPersonF');
const coReportFpund=require('../controllers/reportFound')
const cloud = require('../cloudinary')
const conter=require('../models/conter')


const multerStorage = multer.diskStorage({
  destination: 'public/img/personM',
  filename : async(req,file,cb)=>{
    fileName=file.filename = `person-${Date.now()}.jpeg`
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
const PersonM=await PersonMissing.create({
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
      personM=await PersonMissing.find({$and:[{Accept:true},{gender:obj.gender},{$and:[{yearOfBirth: {$lte:new Date().getFullYear()-Number(obj.minAge)}},{yearOfBirth: {$gte:new Date().getFullYear()-Number(obj.maxAge)}}]} ,{$and:[{height:{$gte:Number(obj.minheight)}},{height:{$lte:Number(obj.maxheight)}}]},{$and:[{weight:{$gt:Number(obj.minweight)}},{weight:{$lt:Number(obj.maxweight)}}]}]}).sort({caseN:-1})
    if(personM.length===0)return next( new AppError(req.t('noFound'),404))
    }
    if(!obj.Name===false){
      personM=await PersonMissing.find({$and:[{Accept:true},{Name:new RegExp(obj.Name,'i')},{gender:obj.gender},{$and:[{yearOfBirth: {$lte:new Date().getFullYear()-Number(obj.minAge)}},{yearOfBirth: {$gte:new Date().getFullYear()-Number(obj.maxAge)}}]} ,{$and:[{height:{$gte:Number(obj.minheight)}},{height:{$lte:Number(obj.maxheight)}}]},{$and:[{weight:{$gt:Number(obj.minweight)}},{weight:{$lt:Number(obj.maxweight)}}]}]}).sort({caseN:-1})
      if(personM.length===0)return next( new AppError(req.t('noFound'),404))
    }
    }
  if(Object.keys(obj).length===0){
    personM=await PersonMissing.find({Accept:true}).sort({caseN:-1})
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
    const personM=await PersonMissing.find({currentUser:currentUser}).sort({
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
  'date',
  'country',
  'state',
  'city',
  'phone',
  'characteristics',
  'circumstances',
  'whatsApp',
  'messangerUserName',
  'latitude',
  'longitude'
  );
  if (req.file) {
    const result = await cloud.uploads(req.file.path)
    filteredBody.photo = result.url;
}
  const updatedUserPerson = await PersonMissing.findOneAndUpdate({ currentUser:req.user.id , _id:req.params.idMissing }, filteredBody, {
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
    const personM=await PersonMissing.findOneAndDelete({currentUser:currentUser,
    _id:req.params.idMissing})
if(!personM){
    return next( new AppError(req.t('noFound'),404))
}

    res.status(200).json({
        status:"success",
        message:req.t('deleteCase'),
        data:'no data'

    })
})
exports.searchData=catchAsync(async(req,res,next)=>{
 const obj=req.query
    Object.keys(obj).forEach(key => {
        if (obj[key] === '') {
          delete obj[key];
        }
      });
   
    
    const personM=await PersonMissing.find({$and:[{Accept:true},obj]}).sort({
      caseN:-1     
  })  
  if(!personM)return next(new AppError(req.t('noFound'),404))
    res.status(200).json({
        status:"success",
        message:'no message',
        data:personM
    })
 
})

exports.conterFound=catchAsync(async(req,res,next)=>{
  const currentUser=req.user._id
  const personM=await PersonMissing.findOneAndDelete({currentUser:currentUser,
  _id:req.params.idMissing})
  const personF=await reportFound.findOneAndDelete({currentUser:currentUser,
    _id:req.params.idMissing})
if(!personM && !personF){
  return next( new AppError(req.t('noFound'),404))
}
const Found=await conter.findById('62667a1cbdca70cb13107c48')
 Found.personFound=Found.personFound+1
 await Found.save()
  res.status(200).json({
      status:"success",
      message:req.t('deleteCase'),
      data:Found

  })
})
exports.getConterFound=catchAsync(async(req,res,next)=>{
  const Found=await conter.findById('62667a1cbdca70cb13107c48')
  res.status(200).json({
    status:"success",
    message:"no massage",
    data:Found

})
})

exports.searchForAllDataPerson=catchAsync(async(req,res,next)=>{
  const obj=req.query
     Object.keys(obj).forEach(key => {
         if (obj[key] === '') {
           delete obj[key];
         }
       });
     const personM=await PersonMissing.find({$and:[{Accept:true},obj]}).sort({caseN:-1})    
     const personF=await reportFound.find({$and:[{Accept:true},obj]}).sort({caseN:-1})  
     const mearg=Object.values([...personM, ...personF]);
     if(!mearg)return next(new AppError(req.t('noFound'),404))
     await mearg.sort(function(a, b){return b.caseN-a.caseN})
     res.status(200).json({
         status:"success",
         message:'no message',
        data:mearg,
       
     })
  
 })

 exports.getAllDataPersonAndLockingFamile=catchAsync(async(req,res,next)=>{
   if(req.params.where==='missing')return this.getData(req,res,next)
   else if(req.params.where==='missingF')return coReportFpund.getData(req,res,next)
   else if(req.params.where==='All'){
  let personM={}
  let personF={}
  const obj=req.query
     Object.keys(obj).forEach(key => {
         if (obj[key] === '') {
           delete obj[key];
         }
       });
      
  if(obj.gender==="male" || obj.gender==="female"){
    //if not git name
    if(!obj.Name===true){                                                              
      personM=await PersonMissing.find({$and:[{Accept:true},{gender:obj.gender},{$and:[{yearOfBirth: {$lte:new Date().getFullYear()-Number(obj.minAge)}},{yearOfBirth: {$gte:new Date().getFullYear()-Number(obj.maxAge)}}]} ,{$and:[{height:{$gte:Number(obj.minheight)}},{height:{$lte:Number(obj.maxheight)}}]},{$and:[{weight:{$gt:Number(obj.minweight)}},{weight:{$lt:Number(obj.maxweight)}}]}]}).sort({caseN:-1})
      personF=await reportFound.find({$and:[{Accept:true},{gender:obj.gender},{$and:[{yearOfBirth: {$lte:new Date().getFullYear()-Number(obj.minAge)}},{yearOfBirth: {$gte:new Date().getFullYear()-Number(obj.maxAge)}}]} ,{$and:[{height:{$gte:Number(obj.minheight)}},{height:{$lte:Number(obj.maxheight)}}]},{$and:[{weight:{$gt:Number(obj.minweight)}},{weight:{$lt:Number(obj.maxweight)}}]}]}).sort({caseN:-1})
    if(personM.length===0&&personF.length===0)return next( new AppError(req.t('noFound'),404))
    }
    //if git name
    if(!obj.Name===false){
      personM=await PersonMissing.find({$and:[{Accept:true},{gender:obj.gender},{Name:new RegExp(obj.Name,'i')},{$and:[{yearOfBirth: {$lte:new Date().getFullYear()-Number(obj.minAge)}},{yearOfBirth: {$gte:new Date().getFullYear()-Number(obj.maxAge)}}]} ,{$and:[{height:{$gte:Number(obj.minheight)}},{height:{$lte:Number(obj.maxheight)}}]},{$and:[{weight:{$gt:Number(obj.minweight)}},{weight:{$lt:Number(obj.maxweight)}}]}]}).sort({caseN:-1})
      personF=await reportFound.find({$and:[{Accept:true},{gender:obj.gender},{Name:new RegExp(obj.Name,'i')},{$and:[{yearOfBirth: {$lte:new Date().getFullYear()-Number(obj.minAge)}},{yearOfBirth: {$gte:new Date().getFullYear()-Number(obj.maxAge)}}]} ,{$and:[{height:{$gte:Number(obj.minheight)}},{height:{$lte:Number(obj.maxheight)}}]},{$and:[{weight:{$gt:Number(obj.minweight)}},{weight:{$lt:Number(obj.maxweight)}}]}]}).sort({caseN:-1})
          if(personM.length===0&&personF.length===0)return next( new AppError(req.t('noFound'),404))
    }
    }
    if(Object.keys(obj).length===0){
       personM=await PersonMissing.find({$and:[{Accept:true},obj]}).sort({caseN:-1})    
       personF=await reportFound.find({$and:[{Accept:true},obj]}).sort({caseN:-1}) 
      if(personM.length===0&&personF.length===0)return next( new AppError(req.t('noFound'),404))
    }
     const mearg=Object.values([...personM, ...personF]);
     if(!mearg)return next(new AppError(req.t('noFound'),404))
     await mearg.sort(function(a, b){return b.caseN-a.caseN})
     res.status(200).json({
         status:"success",
         message:'no message',
        data:mearg,
       
     })
    }else return next(new AppError(req.t('URl'),400))
    
})

