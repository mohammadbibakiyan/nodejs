const catchAsync=require("./../utils/catchAsync")
const Review=require("./../models/reviwModel");
const factory=require("./handlerFactory");


exports.setTourUserIds=(req,res,next)=>{
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user._id;
    next();
}


exports.getAllReview=factory.getAll(Review)
exports.getReview=factory.getOne(Review)
exports.createReview=factory.createOne(Review);
exports.updateReview=factory.updateOne(Review)
exports.deleteReview=factory.deleteOne(Review);