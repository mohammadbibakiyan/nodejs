const express=require("express");
const authController=require("./../controlers/authController");
const bookingController=require("./../controlers/bookingController")
const bookingRoute=express.Router();

bookingRoute.use(authController.protect);

bookingRoute.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

bookingRoute.use(authController.restrictTo('admin', 'lead-guide'));

bookingRoute
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

bookingRoute
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);




module.exports=bookingRoute;