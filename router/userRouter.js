const express=require("express");
const usersController=require("./../controlers/usersController");
const authController=require("./../controlers/authController")
const userRoute=express.Router();

userRoute.post("/signup",authController.signUp);
userRoute.post("/login",authController.login);
userRoute.post("/forgotPassword",authController.forgotPassword);
userRoute.patch("/resetPassword/:token",authController.resetPassword);

userRoute.use(authController.protect);

userRoute.patch("/updateMyPassword",authController.updatePassword);
userRoute.patch("/updateMe",usersController.updateMe)
userRoute.delete("/deleteMe",usersController.deleteMe)
userRoute.get("/me",usersController.getMe,usersController.getUser);

userRoute.use(authController.restrictTo("admin"));

userRoute.route("/").get(usersController.getAllUser).post(usersController.addUser);
userRoute.route("/:id").get(usersController.getUser).patch(usersController.updateUser).delete(usersController.deleteUser);

module.exports=userRoute;