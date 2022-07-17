const express = require('express');
const tourRoute = express.Router();
const toursController = require('../controlers/toursController');
const authController=require("./../controlers/authController");
const reviewRouter=require("./../router/reviewRouter");
// const reviewController=require("./../controlers/reviewController");
// tourRoute.param('id', toursController.checkId);

tourRoute.use("/:tourId/review",reviewRouter);

tourRoute.route("/top-5-cheape").get(toursController.aliasTopTour,toursController.getAllTour)

tourRoute.route("/tour-status").get(toursController.status)

tourRoute.route("/mounthly-plan/:year").get(authController.protect,authController.restrictTo("admin","lead-guide","guide"),toursController.getMonthlyPlan)

tourRoute.route("/tours-within/:distance/center/:latlng/unit/:unit").get(toursController.getToursWithin)
tourRoute.route("/distance/:latlng/unit/:unit").get(toursController.getDistances)
 
tourRoute
.route('/') 
  .get(toursController.getAllTour)
  // .post(toursController.checkBody,toursController.addTour);
  .post(authController.protect,authController.restrictTo("admin","lead-guide"),toursController.addTour);
tourRoute
  .route('/:id')
  .get(toursController.getTour)
  .patch(authController.protect,authController.restrictTo("admin","lead-guide"),toursController.uploadTourImage,toursController.resizeTourPhoto,toursController.updateTour)
  .delete(authController.protect,authController.restrictTo("admin","lead-guide"),toursController.deleteTour);

// tourRoute.route("/:tourId/review").post(authController.protect,authController.restrictTo("user"),reviewController.createReview)

module.exports = tourRoute;
