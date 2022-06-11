// const fs=require("fs");
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const tourRoute = require("../router/toursRouter");
const Tour=require("./../models/tourModel");
const APIFeatures=require("./../utils/apiFeature")
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

exports.aliasTopTour=(req,res,next)=>{
    req.query.sort="-ratingsAverage,price";
    req.query.limit="5";
    next();
}

exports.status=async (req,res)=>{
    try{
        const status=await Tour.aggregate([
            {$match:{ratingsAverage:{$gte:4.5}}},
            {$group:{
                    _id:{$toUpper:"$difficulty"},
                    numTours:{$sum:1},
                    numRating:{$sum:"$ratingsQuantity"},
                    avgRating:{$avg:"$ratingsAverage"},
                    avgPrice:{$avg:"$price"},
                    miniPrice:{$min:"$price"},
                    maxPrice:{$max:"$price"},
                }   
            },
            {
                $sort:{avgPrice:1}
            }
        ])

        res.status(200).json({status:"seccess",data:status})
    }catch(err){
        res.status(404).json({status:"fail",message:err.message})
    }
}

exports.getMonthlyPlan=async (req,res)=>{
    const year=req.params.year*1;
    try{
        const plan=await Tour.aggregate([
            {$unwind:"$startDates"},
            {$match:{
                startDates:{"$gte":new Date(`${year}-01-01`).toISOString(),"$lte":new Date(`${year}-12-30`).toISOString()}
            }},
            {$group:{_id:{$month:{$toDate: '$startDates'}},
                numTourStarts:{$sum:1},
                Tours:{$push:"$name"}
            }},
            {$addFields:{month:"$_id"}},
            {$project:{_id:0}},
            {$sort:{numTourStarts:-1}}
        ])

        res.status(200).json({status:"seccess",data:plan})
    }catch(err){
        res.status(404).json({status:"fail",message:err.message})
    }
}

exports.getAllTour=async (req,res)=>{
    try{
        const features=new APIFeatures(Tour,req.query).filter().sort().limitFields().paginate()
        const tours=await features.query;
        res.status(200).json({status:"seccess",data:tours,results:tours.length})
    }catch(err){
        console.log(err);
        res.status(404).json({status:"fail",message:err})
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



