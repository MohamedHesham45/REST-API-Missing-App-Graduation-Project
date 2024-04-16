const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true,'userName']
      
    },
    email: {
      type: String,
      required: [true,'email1'],
      unique:true,
      lowercase: true,
      validate: [isEmail,'emailv']
      
    
    },
    photo:{
      type:String,
      default:'https://missingtest.herokuapp.com/public/img/user/default.jpg'
    } ,
    role: {
      type: String,
      enum: ['user', 'admin','google'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true,'password1'],
      minlength: [8,'lengthPassword'],
      select: false,

    },
    passwordConfirm: {
      type: String,
      required: [true,'passwordConfirm'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message:'passwordConfirmCheck'
      }
      },
      login:{
        type:Boolean,
        default: true
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,

  });

 



  userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password,12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });

  userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
  
  userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(3).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
  
    this.passwordResetExpires = Date.now() + 10 * 60 *1000 ;
  
    return resetToken;
  };


const User = mongoose.model('User', userSchema);

module.exports = User;


  