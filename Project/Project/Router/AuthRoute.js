const express=require("express");
const { signUp, login } = require("../Controller/AuthController");
const authRoute=express.Router();


authRoute.post('/signUp',signUp);
authRoute.post('/login',login);

module.exports=authRoute;

