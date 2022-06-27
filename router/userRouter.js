const express=require("express");
const usersController=require("./../controlers/usersController");
const authController=require("./../controlers/authController")
const userRoute=express.Router();

userRoute.post("/signup",authController.signUp);
userRoute.post("/login",authController.login);
userRoute.post("/forgotPassword",authController.forgotPassword);
userRoute.patch("/resetPassword/:token",authController.resetPassword);
userRoute.patch("/updateMyPassword",authController.protect,authController.updatePassword);
userRoute.patch("/updateMe",authController.protect,usersController.updateMe)
userRoute.delete("/deleteMe",authController.protect,usersController.deleteMe)

userRoute.route("/").get(usersController.getAllUser).post(usersController.addUser);
userRoute.route("/:id").get(usersController.getUser).patch(usersController.updateUser).delete(usersController.deleteUser);

module.exports=userRoute;