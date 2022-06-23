const express = require('express');
const tourRoute = express.Router();
const toursControler = require('../controlers/toursController');
const authController=require("./../controlers/authController");
// tourRoute.param('id', toursControler.checkId);
tourRoute.route("/top-5-cheape").get(toursControler.aliasTopTour,toursControler.getAllTour)

tourRoute.route("/tour-status").get(toursControler.status)

tourRoute.route("/mounthly-plan/:year").get(toursControler.getMonthlyPlan)

tourRoute
.route('/')
  .get(authController.protect,toursControler.getAllTour)
  // .post(toursControler.checkBody,toursControler.addTour);
  .post(toursControler.addTour);
tourRoute
  .route('/:id')
  .get(toursControler.getTour)
  .patch(toursControler.updateTour)
  .delete(authController.protect,authController.restrictTo("admin","lead-guid"),toursControler.deleteTour);

module.exports = tourRoute;
