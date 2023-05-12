const { Router } = require('express');
const router = Router();
const UserModel = require('../../models/user');
const SaleModel = require('../../models/sale');
const ProductModel = require('../../models/product');
const HarvestModel = require('../../models/harvest');
const { format, parse, getYear } = require('date-fns');

router.get('/totalUsers', async (request, response) => {
  try {
    const totalUsers = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
    });

    return response.status(200).json({ totalUsers });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total users.', reason: error });
  }
});

router.get('/usersAges', async (request, response) => {
  try {
    const zeroToTen =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gt: 0, $lte: 10 },
      })) || 0;
    const elevenToTwenty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gt: 11, $lte: 20 },
      })) || 0;
    const twentyOneToThirty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gte: 21, $lte: 30 },
      })) || 0;
    const thirtyOneToFourty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gte: 31, $lte: 40 },
      })) || 0;
    const fourtyOneToFifty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gte: 41, $lte: 50 },
      })) || 0;
    const fiftyOneToSixty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gte: 51, $lte: 60 },
      })) || 0;
    const sixtyOneToSeventy =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gte: 61, $lte: 70 },
      })) || 0;
    const seventyOneToEighty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gte: 71, $lte: 80 },
      })) || 0;
    const eightyOneToNinety =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gte: 81, $lte: 90 },
      })) || 0;
    const ninetyOneToOneHundred =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        age: { $gte: 91, $lte: 100 },
      })) || 0;

    return response.status(200).json({
      zeroToTen,
      elevenToTwenty,
      twentyOneToThirty,
      thirtyOneToFourty,
      fourtyOneToFifty,
      fiftyOneToSixty,
      sixtyOneToSeventy,
      seventyOneToEighty,
      eightyOneToNinety,
      ninetyOneToOneHundred,
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

    const userTypes = {
      ecd: 0,
      farmer: 0,
      sewing: 0,
      bakery: 0,
      'wood work': 0,
      'garden service': 0,
      'food and beverage': 0,
      gardening: 0,
      nails: 0,
      salon: 0,
      consulting: 0,
      construction: 0,
      other: 0,
    };

    users.map((user) => {
      if (userTypes[user.userType])
        userTypes[user.userType] = userTypes[user.userType] + 1;
      else userTypes[user.userType] = 1;
    });

    return response.status(200).json({ userTypes });
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

router.get('/monthlyProfit/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    const sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    );

    let monthlyProfit = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    sales.map((sale) => {
      const year = getYear(parse(sale.date, 'dd/MM/yyyy', Date.now()));

      if (year > yearMinusYear && year < yearPlusYear) {
        const month = format(
          parse(sale.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );
        const profit = sale.profit;

        if (monthlyProfit[month])
          monthlyProfit[month] = monthlyProfit[month] + profit;
        else monthlyProfit[month] = profit;

        monthlyProfit = Object.keys(monthlyProfit)
          .sort()
          .reduce((obj, key) => {
            obj[key] = monthlyProfit[key];
            return obj;
          }, {});

        return sale;
      } else return sale;
    });

    return response.status(200).json({ monthlyProfit });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly profit.', reason: error });
  }
});

router.get('/monthlyExpenses/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    const sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    ).populate('products', ['_id', 'name', 'cost', 'price']);

    let monthlyExpenses = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    sales.map((sale) => {
      if (year > yearMinusYear && year < yearPlusYear) {
        const month = format(
          parse(sale.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );
        const expenses = sale.products
          .map((product) => product.cost)
          .reduce((partial, num) => partial + num, 0);

        if (monthlyExpenses[month])
          monthlyExpenses[month] = monthlyExpenses[month] + expenses;
        else monthlyExpenses[month] = expenses;

        monthlyExpenses = Object.keys(monthlyExpenses)
          .sort()
          .reduce((obj, key) => {
            obj[key] = monthlyExpenses[key];
            return obj;
          }, {});

        return sale;
      } else return sale;
    });

    return response.status(200).json({ monthlyExpenses });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly expenses.', reason: error });
  }
});

router.get('/monthlySales/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    const sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    ).populate('products', ['_id', 'name', 'cost', 'price']);

    let monthlySales = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    sales.map((sale) => {
      if (year > yearMinusYear && year < yearPlusYear) {
        const month = format(
          parse(sale.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );
        const sales = sale.products
          .map((product) => product.price)
          .reduce((partial, num) => partial + num, 0);

        if (monthlySales[month])
          monthlySales[month] = monthlySales[month] + sales;
        else monthlySales[month] = sales;

        monthlySales = Object.keys(monthlySales)
          .sort()
          .reduce((obj, key) => {
            obj[key] = monthlySales[key];
            return obj;
          }, {});

        return sale;
      } else return sale;
    });

    return response.status(200).json({ monthlySales });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly sales.', reason: error });
  }
});

router.get('/financeTotals/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    const sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    ).populate('products', ['_id', 'name', 'cost', 'price']);

    const totalProfit = sales
      .map(
        (sale) =>
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          sale.profit
      )
      .reduce((partial, num) => partial + num, 0);
    const totalExpenses = sales
      .map(
        (sale) =>
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          sale.products
            .map((product) => product.cost)
            .reduce((partial, num) => partial + num, 0)
      )
      .reduce((partial, num) => partial + num, 0);
    const totalSales = sales
      .map(
        (sale) =>
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          sale.products
            .map((product) => product.price)
            .reduce((partial, num) => partial + num, 0)
      )
      .reduce((partial, num) => partial + num, 0);

    return response
      .status(200)
      .json({ totalProfit, totalExpenses, totalSales });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly sales.', reason: error });
  }
});

router.get('/monthlyHarvests/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    const harvests = await HarvestModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    );

    let monthlyHarvests = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    harvests.map((harvest) => {
      if (year > yearMinusYear && year < yearPlusYear) {
        const month = format(
          parse(harvest.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );

        if (monthlyHarvests[month])
          monthlyHarvests[month] = monthlyHarvests[month] + 1;
        else monthlyHarvests[month] = 1;

        monthlyHarvests = Object.keys(monthlyHarvests)
          .sort()
          .reduce((obj, key) => {
            obj[key] = monthlyHarvests[key];
            return obj;
          }, {});

        return harvest;
      } else return harvest;
    });

    return response.status(200).json({ monthlyHarvests });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly harvests.', reason: error });
  }
});

router.get('/latestSales/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';

  try {
    const latestSales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    )
      .sort({ createdAt: -1 })
      .limit(5);

    return response.status(200).json({ latestSales });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly harvests.', reason: error });
  }
});

router.get('/latestHarvests/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';

  try {
    const latestHarvests = await HarvestModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    )
      .sort({ createdAt: -1 })
      .limit(5);

    return response.status(200).json({ latestHarvests });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly harvests.', reason: error });
  }
});

module.exports = router;
