const express = require('express');
const reviewController = require('./../controlers/reviewController');
const authController = require('./../controlers/authController');
const reviewRoute = express.Router({ mergeParams: true });

reviewRoute.use(authController.protect);

reviewRoute
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

reviewRoute
.route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('user',"admin"),reviewController.updateReview)
  .delete(authController.restrictTo('user',"admin"),reviewController.deleteReview)
module.exports = reviewRoute;
