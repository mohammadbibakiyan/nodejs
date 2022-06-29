const catchAsync=require("./../utils/catchAsync");
const AppError=require("./../utils/appError");
const APIFeatures=require("./../utils/apiFeature");

exports.deleteOne=model=>catchAsync(async (req,res,next)=>{
    const doc=await model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('not exist doc for this id', 404));
    res.status(204).json({ status: 'seccuss', data: null });
});

exports.updateOne=model=>catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new AppError('not exist doc for this id', 404);
    res.status(200).json({ status: 'seccuss', data: doc,message:"updated tour" });
});

exports.createOne=model=>catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res
      .status(201)
      .json({ status: 'seccuss', data: doc, message: 'creted new tour' });
});

exports.getOne=(model,popOption)=>catchAsync(async (req, res,next) => {
  let query=model.findById(req.params.id);
  if(popOption) query.populate(popOption)
  const doc = await query;
  if (!doc) throw new AppError("there is't any doc for this id", 404);
  res.status(200).json({ status: 'seccess', data: doc });
});

exports.getAll=model=>catchAsync(async (req, res,next) => {
  let filter={};
  if(req.params.tourId) filter={tour:req.params.tourId};

  const features = new APIFeatures(model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;
  res
    .status(200)
    .json({ status: 'seccess', data: doc, results: doc.length });
});