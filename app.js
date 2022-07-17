const path=require("path")
const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const mongoSanitize=require("express-mongo-sanitize");
const xss=require("xss-clean");
const tourRoute=require("./router/toursRouter");
const viewRoute=require("./router/viewRouter");
const userRoute=require("./router/userRouter");
const bookingRoute=require("./router/bookingRoute")
const reviewRoute=require("./router/reviewRouter")
const AppError= require("./utils/appError")
const globalErrorHandler=require("./controlers/errorControllers");
const rateLimit=require("express-rate-limit")
const helmet=require("helmet");
const hpp=require("hpp");

app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(`${__dirname}/public`))




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


app.use(helmet({contentSecurityPolicy: {
    useDefaults: true, 
    directives: { 
      'script-src': ["'self'", "https://cdnjs.cloudflare.com/"]  
    }
  }}))

const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"too many request from this api, pleace try again in an hour"
})
app.use("/api",limiter);
app.use(express.json({limit:"10kb"}));
app.use(cookieParser())
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist:["duration","price","ratingsAverage","ratingsQuantity"]
}))
app.use("/",viewRoute)
app.use("/api/v1/tours",tourRoute);
app.use("/api/v1/users",userRoute);
app.use("/api/v1/reviews",reviewRoute)
app.use("/api/v1/booking",bookingRoute);

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