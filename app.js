const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors')
const userRouter = require('./routes/userRoutes');
const AdminRoute = require('./routes/AdminRoute');
const ThingsRoute= require('./routes/thingsRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const sendEmail = require('./utils/email');
const personRouter=require('./routes/personroute')
const URL ="mongodb+srv://missing:missing@missing.hgjky.mongodb.net/Missing?retryWrites=true&w=majority"
mongoose.connect(URL).then(() => console.log('DB connection successful!'));
const i18next=require('i18next')
const Backend=require('i18next-fs-backend')
const middleware=require('i18next-http-middleware');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
  
    fallbackLng: 'en',
    backend: {
      
      loadPath: 'locals/{{lng}}/translation.json'
          
    }
    
 })



const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize())

app.use(middleware.handle(i18next))
app.use('/public',express.static(path.join(__dirname, 'public')));

app.post('/contact-us',async(req, res, next) => {
  await sendEmail({
    name:req.body.name,
    email:req.body.email,
    message:req.body.message,
    phone:req.body.phone,
    subject: req.body.subject,
    fromWhat:'contact-us'
  });

  res.status(200).json({
    status: 'success',
    message: req.body.subject +' '+ req.t('contactMassage'),
  });

});
app.use('/Users', userRouter);
app.use('/Things',ThingsRoute);
app.use('/person',personRouter);
app.use('/Admin',AdminRoute)
  
     app.all('*', (req, res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });
     
  app.use(globalErrorHandler);
  
    
const port =process.env.PORT ||3200;
app.listen(port,()=>{
    console.log("server start in port ",port)
})

module.exports = app;   
