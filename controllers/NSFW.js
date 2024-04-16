const deepai = require('deepai'); 
const AppError = require('../utils/appError');
const catchAsync=require('../utils/catchAsync')

deepai.setApiKey('4dd37aa7-8fc6-432c-a252-872e71e2704f');
exports.NSFWfun=catchAsync(async(req,res,next)=>{
    if(!req.file)return next()
    var resp = await deepai.callStandardApi("nsfw-detector", {
        image: "https://missingtest.herokuapp.com/public/img/personM/"+req.file.filename,
});
if(resp.output.detections.length!=0){
    return next( new AppError(req.t('NSFW'),404))
}
else
next()
})
