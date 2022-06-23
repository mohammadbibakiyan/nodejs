const mongoose =require("mongoose");
const validator=require("validator")
const bcrypt=require("bcrypt");
const crypto=require("crypto");

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
        minlength:8,
    },
    passwordConfirm:{
        type:String,
        required:[true,"enter confirm password"],
        validate:{//فقط زمان save , create این ارزیابی انجام می شود و بهتر است به جای update از save استفاده کنیم تا ارزیابی ها انجام شود
            validator:function(el){
                return el===this.password
            },
            message:"password are not the same"
        }
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpired:{
        type:Date
    },
    role:{
        type:String,
        enum:["admin","guide","lead-guide","user"],
        default:"user"
    },
    passwordChangedAt:Date,
    photo:String,  
});

userSchema.methods.correctPassword=async (condidatePassword,userPassword)=>{
    return await bcrypt.compare(condidatePassword,userPassword)
}
userSchema.methods.changePasswordAfter=(JWTTimeStamp)=>{
    if(this.passwordChangedAt){
        const changedTimeStamp=this.passwordChangedAt.getTime()/1000;
        return JWTTimeStamp<changedTimeStamp
    }
    return false;
}
userSchema.methods.createPasswordResetToken=()=>{
    const resetToken=crypto.randomBytes(30).toString("hex");
    const passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpired=Date.now()+10*60*1000;
    return {resetToken,passwordResetToken,passwordResetExpired};
}

userSchema.pre("save",async function(next){
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
})

userSchema.pre("save",function(next){
    if(!this.isModified("password")||this.isNew) return next();
    this.passwordChangedAt=Date.now()-1000;// شاید طول بکشه تا در پایگاه ذخیره کنه و از اون ور توکن ساخته شده زمانش کمتر از زمان تغییر پسورد باشه و کاربر نیاز باشه دوباره لاگین کنه
    next();
})

const User=mongoose.model("User",userSchema);
module.exports=User;