const express=require("express");
const usersControler=require("./../controlers/usersControler");
const userRoute=express.Router();
userRoute.route("/").get(usersControler.getAllUser).post(usersControler.addUser);
userRoute.route("/:id").get(usersControler.getUser).patch(usersControler.updateUser).delete(usersControler.deleteUser);

module.exports=userRoute;