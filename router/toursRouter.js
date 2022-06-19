const express = require('express');
const tourRoute = express.Router();
const toursControler = require('../controlers/toursController');

// tourRoute.param('id', toursControler.checkId);
tourRoute.route("/top-5-cheape").get(toursControler.aliasTopTour,toursControler.getAllTour)

tourRoute.route("/tour-status").get(toursControler.status)

tourRoute.route("/mounthly-plan/:year").get(toursControler.getMonthlyPlan)

tourRoute
.route('/')
  .get(toursControler.getAllTour)
  // .post(toursControler.checkBody,toursControler.addTour);
  .post(toursControler.addTour);
tourRoute
  .route('/:id')
  .get(toursControler.getTour)
  .patch(toursControler.updateTour)
  .delete(toursControler.deleteTour);

module.exports = tourRoute;
