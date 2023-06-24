const Review = require('../models/reviewModel');
const HandlerFactory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.getAllReviews = HandlerFactory.getAll(Review);
exports.createReview = HandlerFactory.createOne(Review);
exports.getReview = HandlerFactory.getOne(Review);
exports.updateReview = HandlerFactory.updateOne(Review);
exports.deleteReview = HandlerFactory.deleteOne(Review);
