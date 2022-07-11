const express=require("express");
const viewRoute=express.Router();
const viewController=require("./../controlers/viewController");
const authController=require("./../controlers/authController")
viewRoute.use(authController.isLoggedIn)
viewRoute.get("/",viewController.overview)
viewRoute.get("/tour/:slug",viewController.tour)
viewRoute.get("/login",viewController.login)
viewRoute.get("/me",authController.protect,viewController.getAccount)  

module.exports=viewRoute;