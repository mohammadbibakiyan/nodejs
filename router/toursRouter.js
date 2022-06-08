const express = require('express');
const toursControler = require('./../controlers/toursControler');
const tourRoute = express.Router();

// tourRoute.param('id', toursControler.checkId);



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
