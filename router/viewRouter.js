const express=require("express");
const viewRoute=express.Router();
const viewController=require("./../controlers/viewController");

viewRoute.get("/",viewController.overview)
viewRoute.get("/tour/:slug",viewController.tour)

module.exports=viewRoute;