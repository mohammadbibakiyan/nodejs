// const fs=require("fs");
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const tourRoute = require('../router/toursRouter');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeature');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
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

exports.getAllTour = catchAsync(async (req, res,next) => {
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  res
    .status(200)
    .json({ status: 'seccess', data: tours, results: tours.length });
});

exports.getTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) throw new AppError('not exist', 404);
  res.status(200).json({ status: 'seccess', data: tour });
});

exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res
    .status(201)
    .json({ status: 'seccuss', data: newTour, message: 'creted new tour' });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) throw new AppError('not exist', 404);
  res.status(200).json({ status: 'seccuss', data: tour });
});

exports.deleteTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) return next(new AppError('not exist', 404));
  res.status(204).json({ status: 'seccuss', data: null });
});
