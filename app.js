const express=require("express");
const app=express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`))
const tourRoute=require("./router/toursRouter");
const userRoute=require("./router/userRouter");
const AppError= require("./utils/appError")
const globalErrorHandler=require("./controlers/errorControllers");

// const morgan=require("morgan");
// console.log(process.env.NODE_ENV);
// if(process.env.NODE_ENV==="development"){
//     console.log("....");
//     app.use(morgan("dev"))
// }
// app.use((req,res,next)=>{
//     req.timeRequest=new Date().toISOString();
//     next();
// })

app.use("/api/v1/tours",tourRoute);
app.use("/api/v1/users",userRoute);

app.all("*",(req,res,next)=>{
    //first method
    // res.status(404).json({
    //     status:"fail",
    //     message:`cant find ${req.originalUrl} in server`
    // })

    //second method
    // let err=new Error(`cant find ${req.originalUrl} in server`);
    // err.statusCode=404;
    // err.status="fail";
    // next(err);

    //third method
    next(new AppError(`cant find ${req.originalUrl} in server`,404))
})


app.use(globalErrorHandler)
module.exports=app;