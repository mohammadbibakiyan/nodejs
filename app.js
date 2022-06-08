const express=require("express");
const app=express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`))
const tourRoute=require("./router/toursRouter");
const userRoute=require("./router/userRouter");

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

module.exports=app;