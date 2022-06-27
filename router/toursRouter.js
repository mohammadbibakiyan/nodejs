const express = require('express');
const tourRoute = express.Router();
const toursController = require('../controlers/toursController');
const authController=require("./../controlers/authController");
// tourRoute.param('id', toursController.checkId);
tourRoute.route("/top-5-cheape").get(toursController.aliasTopTour,toursController.getAllTour)

tourRoute.route("/tour-status").get(toursController.status)

tourRoute.route("/mounthly-plan/:year").get(toursController.getMonthlyPlan)

tourRoute
.route('/')
  .get(authController.protect,toursController.getAllTour)
  // .post(toursController.checkBody,toursController.addTour);
  .post(toursController.addTour);
tourRoute
  .route('/:id')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(authController.protect,authController.restrictTo("admin","lead-guid"),toursController.deleteTour);

module.exports = tourRoute;
