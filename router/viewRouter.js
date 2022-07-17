const express=require("express");
const viewRoute=express.Router();
const viewController=require("./../controlers/viewController");
const authController=require("./../controlers/authController");
const bookingController=require("./../controlers/bookingController");
viewRoute.use(authController.isLoggedIn)
viewRoute.get("/",bookingController.getCheckoutSession,viewController.overview)
viewRoute.get("/tour/:slug",viewController.tour)
viewRoute.get("/login",viewController.login)
viewRoute.get("/me",authController.protect,viewController.getAccount)  
viewRoute.get("/my-tour",authController.protect,viewController.getMyTour)  

module.exports=viewRoute;