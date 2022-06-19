const mongoose =require("mongoose");
const validator=require("validator")
const bycript=require("bcrypt");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please tell us your name!"]
    },
    email:{
        type:String,
        required:[true,"please provide your email"],
        unique:true,
        lowerCase:true,
        validate:[validator.isEmail,"please provide a valid email"]
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        minlength:8
    },
    passwordConfirm:{
        type:String,
        required:[true,"please confirm yout password"],
        validate:{
            validator:function(el){
                return el===this.password
            },
            message:"password are not the same"
        }
    },
    photo:String
});

userSchema.pre("save",async function(){
    this.password=await bycript.hash(this.password,12);
    this.passwordConfirm=undefined;
})

const User=mongoose.model("USer",userSchema);
module.exports=User;