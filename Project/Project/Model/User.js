const mongoose = require('mongoose');
const bcrypt=require("bcrypt");
const validator=require("validator");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema({
  NationalId: {
    type: Number,
    required: [true, 'National ID is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{14}$/.test(v.toString());
      },
      message: 'National ID must be exactly 14 digits'
    }
  },

  FirstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [4, 'First name must be at least 4 characters'],
    maxlength: [20, 'First name must be at most 20 characters'],
    trim: true
  },

  SecoundName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [4, 'First name must be at least 4 characters'],
    maxlength: [20, 'First name must be at most 20 characters'],
    trim: true
  },

  gender: {
    type: String,
    enum: {
      values: ["male", "female"],
      message: "gender must be male or female"
    }
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },

  phone: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.every(v => /^01[0-9]{9}$/.test(v));
      },
      message: 'Each phone number must be 11 digits and start with 01'
    }
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true,"customer must have password"],
    validate:[
      validator.isStrongPassword,
      "password must have at least 8 characters and include Uppercase,Lowercase,number,and symbol",
    ],
    select:false
  },
    position: {
    type: String,
    required: false,
    enum: ['receptionist', 'housekeeping', 'manager', 'chef', 'security', 'waiter', 'technician'],
    trim: true
  },
  salary: {
    type: Number,
    required: false
  },
  hireDate: {
    type: Date,
    required: false
  },
  role: {
    type: String,
    required:true,
    enum: ['customer', 'staff', 'admin'],
    default:"customer"
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  passwordChangedAt:Date,
}, 
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
}
);

UserSchema.virtual("fullName").get(function () {
  return `${this.FirstName} ${this.SecoundName}`;
});
UserSchema.pre("save",async function (next){
this.password=await bcrypt.hash(this.password,12);
next();
});
UserSchema.pre("save",async function (next){
if (!this.isModified("password")||this.isNew)return next();
this.passwordChangedAt=Date.now()-1000;
});
UserSchema.methods.correctPassword=async function (UserPassword) {
  return await bcrypt.compare(UserPassword,this.password);
};
UserSchema.methods.createPasswordResetToken=function(){
const resetToken=crypto.randomBytes(32).toString("hex");
this.passwordResetToken=crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

this.passwordResetTokenExpires=Date.now()+10*60*1000;
return resetToken;
};
  
const User = mongoose.model('User', UserSchema);
module.exports =User;
