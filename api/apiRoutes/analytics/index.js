const { Router } = require('express');
const router = Router();
const UserModel = require('../../models/user');
const SaleModel = require('../../models/sale');
const ProductModel = require('../../models/product');
const HarvestModel = require('../../models/harvest');
const {
  format,
  parse,
  getYear,
  getMonth,
  isSameMonth,
  parseISO,
} = require('date-fns');

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
    const totalSales = await SaleModel.countDocuments({
      income: { $eq: undefined },
    });

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
            income: { $eq: undefined },
          }
        : { income: { $eq: undefined } }
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
      const saleYear = getYear(parse(sale.date, 'dd/MM/yyyy', Date.now()));

      if (saleYear > yearMinusYear && saleYear < yearPlusYear) {
        const month = format(
          parse(sale.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );
        const profit = parseFloat(sale.profit);

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
            income: { $eq: undefined },
          }
        : { income: { $eq: undefined } }
    );

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
      const saleYear = getYear(parse(sale.date, 'dd/MM/yyyy', Date.now()));

      if (saleYear > yearMinusYear && saleYear < yearPlusYear) {
        const month = format(
          parse(sale.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );
        const expenses = sale.products
          .map((product) => parseFloat(product.cost * product.numberSold))
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
            income: { $eq: undefined },
          }
        : { income: { $eq: undefined } }
    );

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
      const saleYear = getYear(parse(sale.date, 'dd/MM/yyyy', Date.now()));

      if (saleYear > yearMinusYear && saleYear < yearPlusYear) {
        const month = format(
          parse(sale.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );
        const sales = sale.products
          .map((product) => parseFloat(product.price * product.numberSold))
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

router.get('/monthlyIncome/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    const sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
            income: { $ne: undefined },
          }
        : { income: { $ne: undefined } }
    );

    let monthlyIncome = {
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

    sales
      .filter((sale) => sale.income !== null && sale.income !== undefined)
      .map((sale) => {
        const saleYear = getYear(parse(sale.date, 'dd/MM/yyyy', Date.now()));

        if (saleYear > yearMinusYear && saleYear < yearPlusYear) {
          const month = format(
            parse(sale.date, 'dd/MM/yyyy', Date.now()),
            'MMMM'
          );

          if (monthlyIncome[month])
            monthlyIncome[month] =
              monthlyIncome[month] + parseFloat(sale.income);
          else monthlyIncome[month] = parseFloat(sale.income);

          monthlyIncome = Object.keys(monthlyIncome)
            .sort()
            .reduce((obj, key) => {
              obj[key] = monthlyIncome[key];
              return obj;
            }, {});

          return sale;
        } else return sale;
      });

    return response.status(200).json({ monthlyIncome });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly income.', reason: error });
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
            income: { $eq: undefined },
          }
        : { income: { $eq: undefined } }
    ).populate('products', '_id');

    const totalProfit = sales
      .map(
        (sale) =>
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          parseFloat(sale.profit)
      )
      .reduce((partial, num) => partial + num, 0);
    const totalExpenses = sales
      .map(
        (sale) =>
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          sale.products
            .map((product) => parseFloat(product.cost * product.numberSold))
            .reduce((partial, num) => partial + num, 0)
      )
      .reduce((partial, num) => partial + num, 0);
    const totalSales = sales
      .map(
        (sale) =>
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          sale.products
            .map((product) => parseFloat(product.price * product.numberSold))
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

router.get('/monthsHarvests/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const month = request.query.month || format(Date.now(), 'MMMM');
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

    let produceWeights = {
      Beans: 0,
      Beetroot: 0,
      Peppers: 0,
      Broccoli: 0,
      Cabbage: 0,
      Carrots: 0,
      Cauliflower: 0,
      Corn: 0,
      Garlic: 0,
      Pepper: 0,
      Lettuce: 0,
      Onion: 0,
      'Spring onion': 0,
      Peas: 0,
      Potatoes: 0,
      Spinach: 0,
      Tomatoes: 0,
      Chillis: 0,
      Other: 0,
    };
    let produceYields = {
      Beans: 0,
      Beetroot: 0,
      Peppers: 0,
      Broccoli: 0,
      Cabbage: 0,
      Carrots: 0,
      Cauliflower: 0,
      Corn: 0,
      Garlic: 0,
      Pepper: 0,
      Lettuce: 0,
      Onion: 0,
      'Spring onion': 0,
      Peas: 0,
      Potatoes: 0,
      Spinach: 0,
      Tomatoes: 0,
      Chillis: 0,
      Other: 0,
    };
    let produceCounts = {
      Beans: 0,
      Beetroot: 0,
      Peppers: 0,
      Broccoli: 0,
      Cabbage: 0,
      Carrots: 0,
      Cauliflower: 0,
      Corn: 0,
      Garlic: 0,
      Pepper: 0,
      Lettuce: 0,
      Onion: 0,
      'Spring onion': 0,
      Peas: 0,
      Potatoes: 0,
      Spinach: 0,
      Tomatoes: 0,
      Chillis: 0,
      Other: 0,
    };

    harvests.map((harvest) => {
      const harvestYear = getYear(
        parse(harvest.date, 'dd/MM/yyyy', Date.now())
      );

      if (harvestYear > yearMinusYear && harvestYear < yearPlusYear) {
        if (
          month ===
          format(parse(harvest.date, 'dd/MM/yyyy', Date.now()), 'MMMM')
        )
          harvest.produce.map((produce) => {
            if (produceWeights[produce.produceType]) {
              produceWeights[produce.produceType] =
                produceWeights[produce.produceType] +
                parseFloat(produce.weight);
            } else {
              produceWeights[produce.produceType] = parseFloat(produce.weight);
            }

            if (produceYields[produce.produceType]) {
              produceYields[produce.produceType] =
                produceYields[produce.produceType] + parseFloat(produce.yield);
            } else {
              produceYields[produce.produceType] = parseFloat(produce.yield);
            }

            if (produceCounts[produce.produceType]) {
              produceCounts[produce.produceType] =
                produceCounts[produce.produceType] + parseFloat(produce.count);
            } else {
              produceCounts[produce.produceType] = parseFloat(produce.count);
            }
          });
      }
    });

    return response
      .status(200)
      .json({ produceWeights, produceYields, produceCounts });
  } catch (error) {
    console.log(error);
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
