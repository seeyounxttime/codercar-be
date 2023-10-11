const { sendResponse, AppError } = require("../helpers/utils.js");
const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  try {
    // Validate input
    const carData = req.body;

    // Validate required fields
    const requiredFields = {
      make: "Make is empty",
      model: "Model is empty",
      release_date: "Release Date is empty",
      transmission_type: "Transmission Type is empty",
      size: "Vehicle Size is empty",
      style: "Vehicle Style is empty",
      price: "Price is empty",
    };

    const missingFields = [];
    for (const [field, errorMessage] of Object.entries(requiredFields)) {
      if (!carData[field]) {
        missingFields.push(errorMessage);
      }
    }

    if (missingFields.length > 0) {
      throw new AppError(400, "Bad Request", missingFields.join(", "));
    }

    if (!carData) throw new AppError(402, "Bad Request", "Create Car Error");
    const createdCar = await Car.create(carData);
    sendResponse(res, 200, true, createdCar, null, "Create Car Success");
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  //in real project you will getting condition from from req then construct the filter object for query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const offset = (page - 1) * limit;

  // const filter = {_id: ObjectId("648d0ea432e8813d5fe51775")};
  const filter = {};
  const projection = {
    "Engine Fuel Type": 0,
    "Engine HP": 0,
    "Engine Cylinders": 0,
    Driven_Wheels: 0,
    "Number of Doors": 0,
    "Market Category": 0,
    "highway MPG": 0,
    "city mpg": 0,
    Popularity: 0,
  };

  try {
    //mongoose query
    // await Car.updateMany({}, { $set: { isDeleted: false } });
    // await Car.updateMany({}, {
    //   $rename: {
    //     "Make": "make",
    //     "Model": "model",
    //     "Year": "release_date",
    //     "Transmission Type": "transmission_type",
    //     "Vehicle Size": "size",
    //     "Vehicle Style": "style",
    //     "MSRP": "price"
    //   }
    // });

    // console.log('Field names updated successfully.');

    const listOfFound = await Car.find(filter, projection)
      .skip(offset)
      .limit(limit);
    const totalCar = await Car.countDocuments(filter);

    const totalPages = Math.ceil(totalCar / limit);

    sendResponse(
      res,
      200,
      true,
      listOfFound,
      null,
      "Get Car List Successfully!",
      totalCar,
      totalPages
    );
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication
  try {
    const targetId = req.params.id;
    const updateCar = req.body;

    // Validate required fields
    const requiredFields = {
      make: "Make is empty",
      model: "Model is empty",
      release_date: "Release Date is empty",
      transmission_type: "Transmission Type is empty",
      size: "Vehicle Size is empty",
      style: "Vehicle Style is empty",
      price: "Price is empty",
    };

    const missingFields = [];
    for (const [field, errorMessage] of Object.entries(requiredFields)) {
      if (!updateCar[field]) {
        missingFields.push(errorMessage);
      }
    }

    if (missingFields.length > 0) {
      throw new AppError(400, "Bad Request", missingFields.join(", "));
    }

    //options allow you to modify query. e.g new true return lastest update of data
    const options = { new: true };
    //mongoose query
    const updated = await Car.findByIdAndUpdate(targetId, updateCar, options);

    sendResponse(res, 200, true, updated, null, "Update car success");
  } catch (err) {
    next(err);
  }
};

// carController.deleteCar = async (req, res, next) => {
//   //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication

//   // empty target mean delete nothing
//   const targetId = req.params.id;
//   //options allow you to modify query. e.g new true return lastest update of data
//   const options = { new: true };
//   try {
//     //mongoose query
//     const updated = await Car.findByIdAndDelete(targetId, options);

//     sendResponse(res, 200, true, updated, null, "Delete car success");
//   } catch (err) {
//     next(err);
//   }
// };

carController.deleteCar = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    const softDeleteCar = await Car.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      { new: true }
    );

    if (!softDeleteCar) {
      throw new AppError(404, "Not Found", "Car not found");
    }

    sendResponse(
      res,
      200,
      true,
      softDeleteCar,
      null,
      "Soft delete car success"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
