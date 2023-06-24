const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const CatchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = CatchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tour',
    tours,
  });
});

exports.getTour = CatchAsync(async (req, res, next) => {
  //1.get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) return next(new AppError('There is no tour with that name', 404));
  //2.build template

  //3.render template
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = CatchAsync(async (req, res, next) => {
  //Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //Find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
