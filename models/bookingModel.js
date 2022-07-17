const mongoose=require("mongoose");
const bookingSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"booking must have a user"]
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:"Tour",
        required:[true,"booking must have a tour"]
    },
    price:{
        type:Number,
        required:[true,"booking must have a tour"]
    },
    paid:{
        type:Boolean,
        default:true
    },
    createAt:{
        type:Date,
        default:Date.now()
    }
});
const Booking=mongoose.model("Booking",bookingSchema);
bookingSchema.pre(/^find/,function(next){
    this.populate(user).populate({
        path:"tour",
        select:"name"
    })
    next();
})

module.exports=Booking;