const mongoose=require("mongoose");
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"a tour must have a name"],
        unique:true
    },
    duration:{
        type:Number,
        required:[true,"a tour must have a duration"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"a tour must have a group size"]
    },
    difficulty:{
        type:String,
        required:[true,"a tour must have a difficulty"]
    },
    ratingAverage:{
        type:Number,
        default:4.5
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"the tour must have a price"]
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true,"a tour must have a description"]
    },
    discription:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,"a tour must have a cover image"]
    },
    images:[String],
    createAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date]
});
const Tour=mongoose.model("Tour",tourSchema);

module.exports=Tour;