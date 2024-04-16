const nodemailer = require('nodemailer');
const sendGridTransport=require('nodemailer-sendgrid-transport')
const sendEmail = async options => {
  const transporter = nodemailer.createTransport(sendGridTransport({
 
    auth: {
     api_key:process.env.APIsendGrid
    }
  }));
  if(options.fromWhat==='forgot')
    var htmlTemplate =`<center>
    <html lang="en">
        <head>
            <style> 
                .container{   
                    margin: 10% auto;
                    border: 1px solid black;
                    padding: 50px;
                    width: 500px;
                    text-align: left;
                }
                .title{
                    color: #4267b2;
                    font-weight: bold;
                }
                p{
                  color: black;
                    font-size: 16px;
                }
                a{
                  color:white !important; 
                  text-decoration:none; 
                  cursor:pointer;  
                }
                a:hover {
                  color:black !important; 
                  text-decoration:none; 
                  cursor:pointer;
                }
                .button{
                    color:black;
                    background-color: blueviolet;
                    padding: 13px 170px ;
                    border-radius: 5px;
                    font-size: 18px;
                    margin: 10px 0;   
                }
                .code{
                    background-color: #d2e0ee;
                    color: black;
                    padding: 8px 5px ;
                    border-radius: 5px;
                    margin-left: 300px;
                    text-align: center;
                    font-size: 18px;

                }
                .mm{
                    font-size: 50px;
                    color: magenta;
                }
                @media only screen and ( max-width:991px) {
              .code{    
                    padding: 8px 2px ;
                    border-radius: 5px;
                    margin-left: 250px;
                    font-size: 15px;
                }
                .button{
                    padding: 13px 170px ;
                    font-size: 16px;
                    margin: 5px 0;
                }
                } 
            </style>
          </head>
    <body>
            <div class="container">
            <h1 class="title"><span class="mm">M</span>issing</h1>
          <hr>
            <p>welcome, ${options.name}</p>
            <p>We have received a request to forgot your password you can use this code to reset your password </p>
            <input type="text"  value=${options.message} class="code"  readonly></input>
            <p>you can change your password directly by click here </p>
            <a href="https://missingtest.herokuapp.com/users/resetPasswordByBottom/${options.message}" class="button">changing password</a>
            <p>Note</p>
            <p> this code will be invalid after 10 min</p>
        </div>
    </body>
    </html></center>`
  else if(options.fromWhat==='admin' )
  var htmlTemplate =`<center>
  <html lang="en">
      <head>
          <style> 
              .container{   
                  margin: 10% auto;
                  border: 1px solid black;
                  padding: 50px;
                  width: 500px;
                  text-align: left;
              }
              .title{
                  color: #4267b2;
                  font-weight: bold;
              }
              p{
                color: black;
                  font-size: 16px;
              }
              
              .mm{
                  font-size: 50px;
                  color: magenta;
              }
          </style>
        </head>
  <body>
          <div class="container">
          <h1 class="title"><span class="mm">M</span>issing</h1>
        <hr>
          <p>welcome, ${options.name}</p>
          <p>${options.message}</p>
      </div>
  </body>
  </html></center>`
  // 2) Define the email options
  else if(options.fromWhat==='contact-us' ){
  var htmlTemplate =`<center>
  <html lang="en">
      <head>
          <style> 
              .container{   
                  margin: 10% auto;
                  border: 1px solid black;
                  padding: 50px;
                  width: 500px;
                  text-align: left;
              }
              .title{
                  color: #4267b2;
                  font-weight: bold;
              }
              p{
                color: black;
                  font-size: 16px;
              }
              
              .mm{
                  font-size: 50px;
                  color: magenta;
              }
          </style>
        </head>
  <body>
          <div class="container">
          <h1 class="title"><span class="mm">M</span>issing</h1>
        <hr>
          <p>welcome</p>
          <p>This message was sent about : ${options.subject} </p>  
          <p>Message : ${options.message}</p>
          <p>My name : ${options.name}</p>
          <p>My email : ${options.email}</p>
          <p>My phone Number : ${options.phone}</p>
      </div>
  </body>
  </html></center>`
  options.email='missingwebapp@gmail.com'
            }
  const mailOptions = {
    to: options.email ,
    from:`Missing <${process.env.email}>`,
    subject: options.subject,
    html: htmlTemplate
    
    
  };


  
  
  // 3) Actually send the email
  await transporter.sendMail(mailOptions,function(error){
    if (error) {
      console.log(error);
    }
   
  })
 
  
}

module.exports = sendEmail;
 
