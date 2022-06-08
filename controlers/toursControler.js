// const fs=require("fs");
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const tourRoute = require("../router/toursRouter");
const Tour=require("./../models/tourModel");
let tour;

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

exports.getAllTour=async (req,res)=>{
    try{
        const queryObj={...req.query};
        const excludedFields=["page","limit","sort","fields"];
        excludedFields.forEach(el=>delete queryObj[el]);
        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lt|lte)\b/g,match=>`$${match}`);
        const query=Tour.find(JSON.parse(queryStr));
        if(req.query.sort){
            query.sort(req.query.sort);
        }else{
            query.sort("price");
        }
        const tours=await query;
        res.status(200).json({status:"seccess",data:tours,results:tours.length})
    }catch(err){
        res.status(404).json({status:"fail",message:"there is't any data"})
    }
}

exports.getTour=async(req,res)=>{
    try{
        const tour=await Tour.findById(req.params.id);
        if(!tour) throw new Error("not exist")
        res.status(200).json({status:"seccess",data:tour})
    }catch(err){
        res.status(404).json({status:"fail",message:err.message})
    }
}

exports.addTour=async(req,res)=>{
    try{
        const newTour=await Tour.create(req.body);
        res.status(201).json({status:"seccuss",data:newTour,message:"creted new tour"})
    }catch(err){
        res.status(400).json({status:"fail",message:"your input is't valid"})
    }


    // const id=tours.length+1;
    // const newTour=Object.assign({id},req.body);
    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours.json`,JSON.stringify(tours),err=>{
    //     res.status(201).json({status:"seccuss",data:{newTour}})
    // })

}

exports.updateTour=async(req,res)=>{
    try{
        const tour=await Tour.findOneAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({status:"seccuss",data:tour})
    }catch(err){
        res.status(400).json({status:"fail",message:"tour not found"})
    }
}

exports.deleteTour=async(req,res)=>{
    try{
        await Tour.findOneAndDelete(req.params.id);
        res.status(204).json({status:"seccuss",data:null});
    }catch(err){
        res.status(400).json({status:"fail",message:"tour not found"});
    }
}



