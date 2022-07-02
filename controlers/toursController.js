// const fs=require("fs");
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const tourRoute = require('../router/toursRouter');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeature');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory=require("./handlerFactory")
// exports.checkId=(req,res,next,value)=>{
//     const id=value*1;
//     tour=tours.find(e=>e.id===id);
//     if(!tour){
//         return res.status(404).json({status:"fail",message:"invalid data"});
//     }
//     next();
// }

// exports.checkBody=(req,res,next)=>{
//     if(!req.body.name||!req.body.price){
//         return res.status(400).json({status:"fail",message:"body innot correct"})
//     }
//     next()
// }

exports.aliasTopTour = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  next();
};

exports.status = catchAsync(async (req, res,next) => {
  const status = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        miniPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({ status: 'seccess', data: status });
});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`).toISOString(),
          $lte: new Date(`${year}-12-30`).toISOString(),
        },
      },
    },
    {
      $group: {
        _id: { $month: { $toDate: '$startDates' } },
        numTourStarts: { $sum: 1 },
        Tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
  ]);

  res.status(200).json({ status: 'seccess', data: plan });
});

//tours-within/:distancd/center/:latlng/unit/:unit
exports.getToursWithin=catchAsync(async (req,res,next)=>{
  const {distance,latlng,unit }=req.params;
  const [lat,lng]=latlng.split(",");
  const radius=unit==="mi"?distance/3963.2:distance/6378.1;
  if(!lat||!lng) next(new AppError("please provide latitud and longitut in the latlng"));
  const tours=await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}})
  res.status(200).json({data:tours,results:tours.length})
})

exports.getDistances=catchAsync(async (req,res,next)=>{
  const {latlng,unit}=req.params;
  const [lat,lng]=latlng.split(",");
  const multiplier=unit==="mi"?0.000621371:0.001
  const distance=await Tour.aggregate([
    {$geoNear:{
      near:{type:"point",coordinates:[lng*1,lat*1]},
      distanceField:"distance",
      distanceMultiplier:multiplier
    }},
    {$project:{
      name:1,
      distance:1
    }}
  ])
  res.status(200).json({data:distance});
})

exports.getAllTour =factory.getAll(Tour);
exports.getTour = factory.getOne(Tour,{path:"reviews"});
exports.addTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour)
