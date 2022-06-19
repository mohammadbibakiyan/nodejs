const jwt=require("jsonwebtoken");
const User=require("./../models/userModel");
const catchAsync =require("./../utils/catchAsync");

exports.signUp=catchAsync(async (req,res,next)=>{
    //const newUser=await User.create({req.body});
    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfrim:req.body.passwordConfrim
    });
    res.status(201).json({status:"seccuss",data:newUser,token})
})