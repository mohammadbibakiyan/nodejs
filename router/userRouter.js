const express=require("express");
const usersControler=require("./../controlers/usersController");
const authController=require("./../controlers/authController")
const userRoute=express.Router();

userRoute.post("/signup",authController.signUp);
userRoute.post("/login",authController.login);
userRoute.post("/forgotPassword",authController.forgotPassword);
userRoute.patch("/resetPassword/:token",authController.resetPassword);

userRoute.route("/").get(usersControler.getAllUser).post(usersControler.addUser);
userRoute.route("/:id").get(usersControler.getUser).patch(usersControler.updateUser).delete(usersControler.deleteUser);

module.exports=userRoute;