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
const WasteModel = require('../../models/waste');
const TrainingModel = require('../../models/training');

router.get('/totalUsers', async (request, response) => {
  try {
    const totalUsers = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
      userGroup: { $eq: request.user.userGroup }
    });

    return response.status(200).json({ totalUsers });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total users.', reason: error });
  }
});

router.get("/usersChildrenAndDependents", async (request, response) => {
  try {
    const users = await UserModel.find({ userType: { $ne: "admin" }});

    const totalChildren = users.map((user) => user.numberOfChildren).reduce((previous, current) => previous + current, 0);
    const totalDependents = users.map((user) => user.numberOfDependents).reduce((previous, current) => previous + current, 0);

    return response.status(200).json({ totalChildren, totalDependents });
  } catch (error)
  {
    console.log(error);

    return response.status(500).json({ message: "Failed to retrieve users children.", reason: error });
  }
});

router.get('/usersAges', async (request, response) => {
  try {
    const zeroToTen =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gt: 0, $lte: 10 },
      })) || 0;
    const elevenToTwenty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gt: 11, $lte: 20 },
      })) || 0;
    const twentyOneToThirty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gte: 21, $lte: 30 },
      })) || 0;
    const thirtyOneToFourty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gte: 31, $lte: 40 },
      })) || 0;
    const fourtyOneToFifty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gte: 41, $lte: 50 },
      })) || 0;
    const fiftyOneToSixty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gte: 51, $lte: 60 },
      })) || 0;
    const sixtyOneToSeventy =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gte: 61, $lte: 70 },
      })) || 0;
    const seventyOneToEighty =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gte: 71, $lte: 80 },
      })) || 0;
    const eightyOneToNinety =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
        age: { $gte: 81, $lte: 90 },
      })) || 0;
    const ninetyOneToOneHundred =
      (await UserModel.countDocuments({
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup },
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
      userGroup: { $eq: request.user.userGroup },
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
    }).populate("user");

    const data = totalSales.filter((sale) => sale.user.userGroup === request.user.userGroup);

    return response.status(200).json({ totalSales: data });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total sales.', reason: error });
  }
});

router.get('/totalHarvests', async (request, response) => {
  try {
    const totalHarvests = await HarvestModel.countDocuments().populate("user");

    const data = totalHarvests.filter((harvest) => harvest.user.userGroup === request.user.userGroup);

    return response.status(200).json({ totalHarvests: data });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve total harvests.', reason: error });
  }
});

router.get('/totalProducts', async (request, response) => {
  try {
    const totalProducts = await ProductModel.countDocuments().populate("user");

    const data = totalProduct.filter((product) => product.user.userGroup === request.user.userGroup);

    return response.status(200).json({ totalProducts: data });
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
    let sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
            income: { $eq: undefined },
          }
        : { 
            income: { $eq: undefined },
          },
    ).populate("user");

    if (userId === "all") sales = sales.filter((sale) => sale.user.userGroup === request.user.userGroup);

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

        return sale;
      } else return sale;
    });

    monthlyProfit = Object.keys(monthlyProfit)
      .sort()
      .reduce((obj, key) => {
        obj[key] = monthlyProfit[key];
        return obj;
      }, {});

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
    let sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
            income: { $eq: undefined },
          }
        : { 
            income: { $eq: undefined },
          }
    ).populate("user");

    if (userId === "all") sales = sales.filter((sale) => sale.user.userGroup === request.user.userGroup);

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
    let sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
            income: { $eq: undefined },
          }
        : { 
            income: { $eq: undefined },
          }
    );

    if (userId === "all") sales = sales.filter((sale) => sale.user.userGroup === request.user.userGroup);

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
    let sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
            income: { $ne: undefined },
          }
        : {
            income: { $ne: undefined },
          }
    ).populate("user");

    if (userId === "all") sales = sales.filter((sale) => sale.user.userGroup === request.user.userGroup);

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

router.get('/monthlyWaste/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    let waste = await WasteModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {
          }
    ).populate("user");

    if (userId === "all") waste = waste.filter((waste) => waste.user.userGroup === request.user.userGroup);

    let monthlyFoodWaste = {
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
    let monthlyOtherWaste = {
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

    waste.map((waste) => {
      const wasteYear = getYear(parse(waste.date, 'dd/MM/yyyy', Date.now()));

      if (wasteYear > yearMinusYear && wasteYear < yearPlusYear) {
        const month = format(
          parse(waste.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );

        switch (waste.wasteType) {
          case 'Food Waste': {
            monthlyFoodWaste[month] =
              monthlyFoodWaste[month] + parseFloat(waste.kgs);

            break;
          }
          default: {
            monthlyOtherWaste[month] =
              monthlyOtherWaste[month] + parseFloat(waste.kgs);

            break;
          }
        }

        return waste;
      } else return waste;
    });

    monthlyFoodWaste = Object.keys(monthlyFoodWaste).reduce((obj, key) => {
      obj[key] = monthlyFoodWaste[key];
      return obj;
    }, {});
    monthlyOtherWaste = Object.keys(monthlyOtherWaste).reduce((obj, key) => {
      obj[key] = monthlyOtherWaste[key];
      return obj;
    }, {});

    return response.status(200).json({ monthlyFoodWaste, monthlyOtherWaste });
  } catch (error) {
    console.log(error);

    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly waste.', reason: error });
  }
});

router.get('/monthlyTraining/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    let training = await TrainingModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {
          }
    ).populate("user");

    if (userId === "all") training = training.filter((training) => training.user.userGroup === request.user.userGroup);

    let monthlyTownshipEconomyTraining = {
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
    let monthlyEcdBusinessTraining = {
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
    let monthlyEcdItTraining = {
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
    let monthlyAgriTraining = {
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
    let monthlyOtherTraining = {
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

    training.map((training) => {
      const trainingYear = getYear(
        parse(training.date, 'dd/MM/yyyy', Date.now())
      );

      if (trainingYear > yearMinusYear && trainingYear < yearPlusYear) {
        const month = format(
          parse(training.date, 'dd/MM/yyyy', Date.now()),
          'MMMM'
        );

        switch (training.trainingType) {
          case 'Township Economy': {
            monthlyTownshipEconomyTraining[month] =
              monthlyTownshipEconomyTraining[month] +
              parseFloat(training.numberTrained);
          }
          case 'ECD Business': {
            monthlyEcdBusinessTraining[month] =
              monthlyEcdBusinessTraining[month] +
              parseFloat(training.numberTrained);
          }
          case 'ECD IT': {
            monthlyEcdItTraining[month] =
              monthlyEcdItTraining[month] + parseFloat(training.numberTrained);
          }
          case 'Agri': {
            monthlyAgriTraining[month] =
              monthlyAgriTraining[month] + parseFloat(training.numberTrained);
          }
          case 'Other': {
            monthlyOtherTraining[month] =
              monthlyOtherTraining[month] + parseFloat(training.numberTrained);
          }
        }

        return training;
      } else return training;
    });

    return response.status(200).json({
      monthlyTownshipEconomyTraining,
      monthlyEcdBusinessTraining,
      monthlyEcdItTraining,
      monthlyAgriTraining,
      monthlyOtherTraining,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly training.', reason: error });
  }
});

router.get('/financeTotals/:userId', async (request, response) => {
  const userId = request.params.userId || 'all';
  const year = parseInt(request.query.year) || getYear(Date.now());
  const yearMinusYear = year - 1;
  const yearPlusYear = year + 1;

  try {
    let sales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    ).populate("user");

    if (userId === "all") sales = sales.filter((sale) => sale.user.userGroup === request.user.userGroup);

    const totalProfit = sales
      .map(
        (sale) =>
          sale.income == undefined &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          parseFloat(sale.profit)
      )
      .reduce((partial, num) => partial + num, 0);
    const totalExpenses = sales
      .map(
        (sale) =>
          sale.income == undefined &&
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
          sale.income == undefined &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          sale.products
            .map((product) => parseFloat(product.price * product.numberSold))
            .reduce((partial, num) => partial + num, 0)
      )
      .reduce((partial, num) => partial + num, 0);
    const totalIncome = sales
      .map(
        (sale) =>
          sale.income != undefined &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) > yearMinusYear &&
          getYear(parse(sale.date, 'dd/MM/yyyy', Date.now())) < yearPlusYear &&
          parseFloat(sale.income)
      )
      .reduce((partial, num) => partial + num, 0);

    console.log(totalIncome);

    return response
      .status(200)
      .json({ totalProfit, totalExpenses, totalSales, totalIncome });
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
    let harvests = await HarvestModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    ).populate("user");

    if (userId === "all") harvests = harvests.filter((harvest) => harvest.user.userGroup === request.user.userGroup);

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
    let latestSales = await SaleModel.find(
      userId !== 'all'
        ? {
            user: { $eq: userId },
          }
        : {}
    )
      .sort({ createdAt: -1 })
      .limit(5).populate("user");

    if (userId === "all") latestSales = latestSales.filter((sale) => sale.user.userGroup === request.user.userGroup);

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
      .limit(5).populate("user");

    if (userId === "all") latestHarvests = latestHarvests.filter((harvest) => harvest.user.userGroup === request.user.userGroup);

    return response.status(200).json({ latestHarvests });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve monthly harvests.', reason: error });
  }
});

module.exports = router;
