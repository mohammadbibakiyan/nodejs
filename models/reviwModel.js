const mongoose=require("mongoose");
const Tour=require("./tourModel");
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

reviewShema.index({user:1,tour:1},{unique:true})


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

reviewShema.statics.calculateAvrageRating=async function(tourId){
    const status=await this.aggregate([
        {$match:{tour:tourId}},
        {$group:{
            _id:null,
            nRating:{$sum:1},
            avgRating:{$avg:"$rating"}
        }}
    ])
    if(status.length>0){
        await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:status[0].avgRating,
        ratingsQuantity:status[0].nRating,
    })}else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingsAverage:4.5,
            ratingsQuantity:0,
        })
    }
};

reviewShema.post("save",async function(doc,next){
    await doc.constructor.calculateAvrageRating(doc.tour);
    next();
})

//findByIdAndUpdate,findByIdAndDelete
// reviewShema.pre(/^findOneAnd/,async function(next){
//     this.review=await this.findOne();
//     next();
// });
reviewShema.post(/^findOne/,function(doc,next){
    doc.constructor.calculateAvrageRating(doc.tour)
    next();
})

const Review=new mongoose.model("Review",reviewShema);
module.exports=Review;