const mongoose=require("mongoose");

const reviewShema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,"review can't be empty!"]
    },
    rating:{
        type:Number,
        max:5,
        min:1
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"review must belong to a user"]
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:"Tour",
        required:[true,"review must belong to a tour"]
    }
},{
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
});



reviewShema.pre(/^find/,function(next){
    // this.populate({
    //     path:"user",
    //     select:"name photo"
    // }).populate({
    //     path:"tour",
    //     select:"name"
    // })
    this.populate({
        path:"user",
        select:"name"
    })
    next();
})
const Review=new mongoose.model("Review",reviewShema);
module.exports=Review;