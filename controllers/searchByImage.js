const catchAsync=require('../utils/catchAsync')
const PersonMissing=require('../models/missingPerson')
const AppError = require('../utils/appError');
const reportFound=require('../models/missingPersonF');
const fetch =require( 'node-fetch');

exports.searchPhoto=catchAsync(async(req,res,next)=>{
    if(!req.file)return next(new AppError(req.t('photoReq'),400))
    a={photoSearch:"https://missingtest.herokuapp.com/public/img/personM/"+req.file.filename}
    personM=await PersonMissing.find({Accept:true})  
    personF=await reportFound.find({Accept:true})
    const mearg=Object.values([a,...personM, ...personF]);
    
    data= await sendImageSearch(mearg,'https://testmyho.herokuapp.com/search')
    if(data.length===0) return next(new AppError(req.t('not_found_image'),404))
    if(data==false) return next(new AppError(req.t('noFace'),400))
    
    res.status(200).json({
      status:"success",
      message:'no message',
      data
    
  })
  })
   exports.photoUploadPerson=catchAsync(async(req,res,next)=>{
    if(!req.file)return next(new AppError(req.t('photoReq'),400))
    a={photoSearch:"https://missingtest.herokuapp.com/public/img/personM/"+req.file.filename}
    personM=await PersonMissing.find()  
    personF=await reportFound.find()   

    const mearg=Object.values([a,...personM,...personF]);

    data= await sendImageSearch(mearg,'https://testmyho.herokuapp.com/search')
    if(data.length===0) return next()
    if(data==false) return next(new AppError(req.t('noFace'),400))
    if(data[0].Accept===false){
      res.status(400).json({
        status:"fail",
        message:req.t('uploaded_butNotAccept'),
        data
      
    })
    }
    res.status(400).json({
      status:"fail",
      message:req.t('uploaded'),
      data
    
  })
  })
  exports.faceNo=catchAsync(async(req,res,next)=>{
    if(!req.file)return next()
    a={photoSearch:"https://missingtest.herokuapp.com/public/img/personM/"+req.file.filename}
    personM=await PersonMissing.find()  
    personF=await reportFound.find()   

    const mearg=Object.values([a,...personM,...personF]);

    data= await sendImageSearch(mearg,'https://testmyho.herokuapp.com/search')
    if(data.length===0) return next()
    if(data==false) return next(new AppError(req.t('noFace'),400))
    if(data[0].Accept===false){
      res.status(400).json({
        status:"fail",
        message:req.t('uploaded_butNotAccept'),
        data
      
    })
    }
    res.status(400).json({
      status:"fail",
      message:req.t('uploaded'),
      data
    
  })
  })
  exports.NoFace=catchAsync(async(req,res,next)=>{
    if(!req.file)return next()
    a={photo:"https://missingtest.herokuapp.com/public/img/personM/"+req.file.filename}
    data= await sendImageSearch(a,'https://testmyho.herokuapp.com/face')
    if(data===true) return next(new AppError(req.t('haveFace'),400))
    next()
  })

  const sendImageSearch = async (data,url) => {
    const response = await fetch(url, {method: 'POST', body:JSON.stringify(data)});
    const data1 = await response.json();
    return data1
  };
