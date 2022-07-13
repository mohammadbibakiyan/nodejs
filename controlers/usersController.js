const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory=require("./handlerFactory");
const multer=require("multer");
const sharp=require("sharp");

// const multerStorage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,"public/img/users")
//   },
//   filename:(req,file,cb)=>{
//     const ext=file.mimetype.split("/")[1];
//     cb(null,`user-${req.user._id}-${Date.now()}.${ext}`)
//   }
// })
const multerStorage=multer.memoryStorage();

const multerFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith("image")){
    cb(null,true)
  }else{
    cb(new AppError("please upload image file",400),false)
  }
}

const upload =multer({
  storage:multerStorage,
  fileFilter:multerFilter
});

exports.resizeUserPhoto=(req,res,next)=>{
  if(!req.file) return next();
  req.file.filename=`user-${req.user._id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer).resize(500,500).toFormat("jpeg").jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
  next()
}

exports.uploadUserPhoto=upload.single("photo");

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)){newObj[el] = obj[el]};
  });
  return newObj;
};
 
exports.updateMe=catchAsync(async (req,res,next)=>{
    if(req.body.password||req.body.confirmPassword){
        next(new AppError("this route for update data not password please use updateMePassword"));
    }
    const filterFields=filterObj(req.body,"name","email")
    if(req.file) filterFields.photo=req.file.filename;
    const user=await User.findByIdAndUpdate(req.user._id,filterFields,{new:true,runValidators:true});
    res.status(200).json({status:"success",message:"update complited",data:user})
});

exports.deleteMe=catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false});
  res.status(204).json({status:"success", message:"user deleted", data:null})
});



exports.addUser = (req,res,next)=>{
  res.status(500).json({message:"this route not defind please use from signup path"})
}

exports.getMe=(req,res,next)=>{
  req.params.id=req.user._id;
  next();
}

exports.getAllUser =factory.getAll(User);
exports.getUser =factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
