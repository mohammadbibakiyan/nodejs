const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({path:"./config.env"})
const app=require("./app");
const port=3000;

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    // useUnifiedTopology:true
    useUnifiedTopology:true
}).then(()=>console.log("db connection successful")).catch(()=>{
    console.log("db connection faild");
})

app.listen(port,()=>{
    console.log("run server");
})