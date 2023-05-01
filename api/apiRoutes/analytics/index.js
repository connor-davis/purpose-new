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

    return response.status(200).send(usersCount);
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total users.', reason: error });
  }
});

router.get('/usersAges', async (request, response) => {
  try {
    const zeroToNineteen = [];
    const twentyToTwentyNine = [];
    const thirtyToThirtyNine = [];
    const fortyToFortyNine = [];
    const fiftyToFiftyNine = [];
    const sixtyToSixtyNine = [];
    const seventyToSeventyNine = [];
    const eightyToEightyNine = [];
    const ninetyToNinetyNine = [];

    const users = await UserModel.find({ userType: { $ne: 'admin' } });

    users.map((user) => {
      if (user.age > 0 && user.age < 20) zeroToNineteen.push(user);
      if (user.age >= 20 && user.age < 30) twentyToTwentyNine.push(user);
      if (user.age >= 30 && user.age < 40) thirtyToThirtyNine.push(user);
      if (user.age >= 40 && user.age < 50) fortyToFortyNine.push(user);
      if (user.age >= 50 && user.age < 60) fiftyToFiftyNine.push(user);
      if (user.age >= 60 && user.age < 70) sixtyToSixtyNine.push(user);
      if (user.age >= 70 && user.age < 80) seventyToSeventyNine.push(user);
      if (user.age >= 80 && user.age < 90) eightyToEightyNine.push(user);
      if (user.age >= 90 && user.age < 100) ninetyToNinetyNine.push(user);
    });

    return response.status(200).json({
      zeroToNineteen,
      twentyToTwentyNine,
      thirtyToThirtyNine,
      fortyToFortyNine,
      fiftyToFiftyNine,
      sixtyToSixtyNine,
      seventyToSeventyNine,
      eightyToEightyNine,
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
    const users = await UserModel.find({ userType: { $ne: 'admin' } });

    const userTypes = users.map((user) => user.userType);

    return response.status(200).json(userTypes);
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve user types.', reason: error });
  }
});

router.get('/totalSales', async (request, response) => {
  try {
    const salesCount = await SaleModel.countDocuments();

    return response.status(200).send(salesCount);
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total sales.', reason: error });
  }
});

// router.get('/latestSales', async (request, response) => {});

router.get('/totalHarvests', async (request, response) => {
  try {
    const totalHarvests = await HarvestModel.countDocuments();

    return response.status(200).send(totalHarvests);
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total harvests.', reason: error });
  }
});

router.get('/totalProducts', async (request, response) => {
  try {
    const totalProducts = await ProductModel.countDocuments();

    return response.status(200).send(totalProducts);
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total products.', reason: error });
  }
});

router.get('/totalProduce', async (request, response) => {
  try {
    const totalProduce = await ProduceModel.countDocuments();

    return response.status(200).send(totalProduce);
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
