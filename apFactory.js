const catchThread = require("catch-thread");
const AppError = require("ap-err");
const ApEzFeature = require("ap-ez");

//* GET ALL
exports.getAll = (Model) =>
  catchThread(async (req, res) => {
    // To allow for nested routes
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // BUILD THE QUERY
    const features = new ApEzFeature(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // EXECUTE QUERY
    const doc = await features.dbQuery;

    //SEND RESPONSE TO USER
    res.status(200).json({ status: "success", results: doc.length, data: doc });
  });

//* GET ONE
exports.getOne = (Model, popOptions) =>
  catchThread(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate("reviews");
    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: doc });
  });

// *CREATE ONE
exports.createOne = (Model) =>
  catchThread(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: "success", data: doc });
  });

// *UPDATE ONE
exports.updateOne = (Model) =>
  catchThread(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //Return the new document
      runValidators: true, //Validate that input values are of correct type
    });

    if (!doc) {
      throw new AppError("No document found with that ID", 404);
    }

    res.status(200).json({ status: "success", data: { doc } });
  });

// *DELETE ONE - HANDLER FACTORY
exports.deleteOne = (Model) =>
  catchThread(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      throw new AppError("No document found with that ID", 404);
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
