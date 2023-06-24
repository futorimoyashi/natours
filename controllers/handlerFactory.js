const CatchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that id', '404'));
    }

    res.status(204).json({
      status: 'susscess',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that id', '404'));
    }

    res.status(200).json({
      status: 'susscess',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'susscess',
      data: { data: doc },
    });
  });

exports.getOne = (Model, popOptions) =>
  CatchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that id', '404'));
    }

    res.status(200).json({
      status: 'susscess',
      data: { doc },
    });
  });

exports.getAll = (Model) =>
  CatchAsync(async (req, res, next) => {
    //To allow for nested get reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    //excute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query.exec();

    //send response
    res.status(200).json({
      status: 'susscess',
      result: doc.length,
      data: { doc },
    });
  });
