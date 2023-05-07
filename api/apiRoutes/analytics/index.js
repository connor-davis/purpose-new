const { Router } = require('express');
const router = Router();
const UserModel = require('../../models/user');
const SaleModel = require('../../models/sale');
const ProductModel = require('../../models/product');
const HarvestModel = require('../../models/harvest');
const ProduceModel = require('../../models/produce');

router.get('/totalUsers', async (request, response) => {
  try {
    const usersCount = await UserModel.countDocuments();

    return response.status(200).json({ usersCount });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total users.', reason: error });
  }
});

router.get('/usersAges', async (request, response) => {
  try {
    const zeroToNineteen = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gt: 0, $lt: 20 },
    });
    const twentyToTwentyNine = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gte: 20, $lt: 30 },
    });
    const thirtyToThirtyNine = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gte: 30, $lt: 40 },
    });
    const fourtyToFourtyNine = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gte: 40, $lt: 50 },
    });
    const fiftyToFiftyNine = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gte: 50, $lt: 60 },
    });
    const sixtyToSixtyNine = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gte: 60, $lt: 70 },
    });
    const seventyToSeventyNine = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gte: 70, $lt: 80 },
    });
    const eightyToEightNine = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gte: 80, $lt: 90 },
    });
    const ninetyToNinetyNine = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      age: { $gte: 90, $lt: 100 },
    });

    return response.status(200).json({
      zeroToNineteen,
      twentyToTwentyNine,
      thirtyToThirtyNine,
      fourtyToFourtyNine,
      fiftyToFiftyNine,
      sixtyToSixtyNine,
      seventyToSeventyNine,
      eightyToEightNine,
      ninetyToNinetyNine,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve users ages.', reason: error });
  }
});

router.get('/userTypes', async (request, response) => {
  try {
    const users = await UserModel.find({
      userType: { $nin: ['admin', null, undefined] },
    });

    const userTypes = users.map((user) => {
      return user.toJSON().userType;
    });
    const typesDeDuplicated = [...new Set(userTypes)];

    const typesCounted = [];

    for (let index in typesDeDuplicated) {
      typesCounted.push({
        userType: typesDeDuplicated[index],
        count: await UserModel.countDocuments({
          userType: { $eq: typesDeDuplicated[index] },
        }),
      });
    }

    return response.status(200).json(typesCounted);
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve user types.', reason: error });
  }
});

router.get('/totalSales', async (request, response) => {
  try {
    const totalSales = await SaleModel.countDocuments();

    return response.status(200).json({ totalSales });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total sales.', reason: error });
  }
});

router.get('/totalHarvests', async (request, response) => {
  try {
    const totalHarvests = await HarvestModel.countDocuments();

    return response.status(200).json({ totalHarvests });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total harvests.', reason: error });
  }
});

router.get('/totalProducts', async (request, response) => {
  try {
    const totalProducts = await ProductModel.countDocuments();

    return response.status(200).json({ totalProducts });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total products.', reason: error });
  }
});

router.get('/totalProduce', async (request, response) => {
  try {
    const totalProduce = await ProduceModel.countDocuments();

    return response.status(200).json({ totalProduce });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total produce.', reason: error });
  }
});

// router.get('/monthlyProfit', async (request, response) => {});

// router.get('/monthlyHarvests', async (request, response) => {});

// router.get('/numberOfChildrenPerEcd', async (request, response) => {});

// router.get('/genderDominance', async (request, response) => {});

module.exports = router;
