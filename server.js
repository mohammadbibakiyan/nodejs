const mongose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({path:"./config.env"})
const app=require("./app");
const port=3000;

mongose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>console.log("db connection successful")).catch(()=>{
    console.log("db connection faild");
})


app.listen(port,()=>{
    console.log("run server");
})