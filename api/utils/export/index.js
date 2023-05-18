let fs = require('fs');
let path = require('path');
let ExcelJS = require('exceljs');
let moment = require('moment');
const { v4 } = require('uuid');
const UserModel = require('../../models/user');
const ProductModel = require('../../models/product');
const SaleModel = require('../../models/sale');
const HarvestModel = require('../../models/harvest');
const exportUsers = require('./users');
const exportProducts = require('./products');
const exportSales = require('./sales');
const exportHarvests = require('./harvests');

const exportAllData = async (request, response, next) => {
  const userId = request.params.userId || 'all';
  const fileName = request.query.fileName
    ? request.query.fileName + '.xlsx'
    : 'all.data.' + moment(Date.now()).format('DD-MM-YYYY') + '.xlsx';

  let workbook = new ExcelJS.Workbook();

  workbook.creator = 'Purpose360';
  workbook.lastModifiedBy = 'Purpose360 API';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Users

  if (userId === 'all') {
    let usersSheet = workbook.addWorksheet('Users', {
      headerFooter: { firstHeader: 'Email' },
    });

    const columns = [
      { header: 'Email', key: 'email' },
      { header: 'Completed Profile', key: 'completedProfile' },
      { header: 'Agreed To Terms', key: 'agreedToTerms' },
      { header: 'User Type', key: 'userType' },
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'ID Number', key: 'idNumber' },
      { header: 'Age', key: 'age' },
      { header: 'Gender', key: 'gender' },
      { header: 'Ethnicity', key: 'ethnicity' },
      { header: 'Business Name', key: 'businessName' },
      { header: 'Business Description', key: 'businessDescription' },
      { header: 'Position At ECD', key: 'positionAtECD' },
      { header: 'Number Of Children', key: 'numberOfChildren' },
      { header: 'Business Registered', key: 'businessRegistered' },
      {
        header: 'Business Registration Number',
        key: 'businessRegistrationNumber',
      },
      {
        header: 'Number Of Employees',
        key: 'businessNumberOfEmployees',
      },
      { header: 'Website', key: 'websiteUrl' },
      { header: 'Facebook Page', key: 'facebookPageUrl' },
      { header: 'Instagram Page', key: 'instagramPageUrl' },
      { header: 'YouTube Channel', key: 'youtubeChannelUrl' },
      { header: 'Account Number', key: 'accountNumber' },
      { header: 'Bank Name', key: 'bankName' },
      { header: 'Branch Code', key: 'bankBranchCode' },
      { header: 'Street Address', key: 'streetAddress' },
      { header: 'Suburb', key: 'suburb' },
      { header: 'Ward', key: 'ward' },
      { header: 'City', key: 'city' },
      { header: 'Area Code', key: 'areaCode' },
      { header: 'Province', key: 'province' },
      { header: 'Country', key: 'country' },
      { header: 'Location', key: 'location' },
    ];

    usersSheet.columns = columns;

    usersSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '#171717' },
      bgColor: { argb: '#171717' },
    };
    usersSheet.getRow(1).border = {
      left: {
        style: 'dotted',
        color: { argb: '#404040' },
      },
      top: {
        style: 'dotted',
        color: { argb: '#404040' },
      },
      right: {
        style: 'dotted',
        color: { argb: '#404040' },
      },
      bottom: {
        style: 'dotted',
        color: { argb: '#404040' },
      },
    };
    usersSheet.getRow(1).font = {
      color: { argb: '#FFFFFF' },
    };

    const users = await UserModel.find({ userType: { $ne: 'admin' } });

    users.forEach((user) => {
      usersSheet.addRow(user);
    });

    usersSheet.columns.forEach((column) => {
      const lengths = column.values.map((v) => v.toString().length);
      column.width = Math.max(...lengths.filter((v) => typeof v === 'number'));
    });
  }

  let productsSheet = workbook.addWorksheet('Products', {
    headerFooter: { firstHeader: 'Name' },
  });

  const productsColumns = [
    { header: 'Name', key: 'name' },
    { header: 'Cost (R)', key: 'cost' },
    { header: 'Price (R)', key: 'price' },
    { header: 'User', key: 'user' },
  ];

  productsSheet.columns = productsColumns;

  productsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '#171717' },
    bgColor: { argb: '#171717' },
  };
  productsSheet.getRow(1).border = {
    left: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    top: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    right: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    bottom: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
  };
  productsSheet.getRow(1).font = {
    color: { argb: '#FFFFFF' },
  };

  let salesSheet = workbook.addWorksheet('Sales', {
    headerFooter: { firstHeader: 'Date' },
  });

  const salesColumns = [
    { header: 'Date', key: 'date' },
    { header: 'Products Sold', key: 'products' },
    { header: 'Profit (R)', key: 'profit' },
    { header: 'Income (R)', key: 'income' },
    { header: 'User', key: 'user' },
  ];

  salesSheet.columns = salesColumns;

  salesSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '#171717' },
    bgColor: { argb: '#171717' },
  };
  salesSheet.getRow(1).border = {
    left: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    top: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    right: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    bottom: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
  };
  salesSheet.getRow(1).font = {
    color: { argb: '#FFFFFF' },
  };

  let harvestsSheet = workbook.addWorksheet('Harvests', {
    headerFooter: { firstHeader: 'Date' },
  });

  const harvestsColumns = [
    { header: 'Date', key: 'date' },
    { header: 'Produce Harvested', key: 'produce' },
    { header: 'User', key: 'user' },
  ];

  harvestsSheet.columns = harvestsColumns;

  harvestsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '#171717' },
    bgColor: { argb: '#171717' },
  };
  harvestsSheet.getRow(1).border = {
    left: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    top: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    right: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
    bottom: {
      style: 'dotted',
      color: { argb: '#404040' },
    },
  };
  harvestsSheet.getRow(1).font = {
    color: { argb: '#FFFFFF' },
  };

  // Products

  const products = await ProductModel.find(
    userId !== 'all'
      ? {
          user: { $eq: userId },
        }
      : {}
  ).populate('user', 'email');

  products.forEach((product) =>
    productsSheet.addRow({
      name: product.name,
      cost: product.cost,
      price: product.price,
      user: product.user.email,
    })
  );

  // Sales

  const sales = await SaleModel.find(
    userId !== 'all'
      ? {
          user: { $eq: userId },
        }
      : {}
  ).populate('user', 'email');

  sales.forEach(async (sale) =>
    salesSheet.addRow({
      date: sale.date,
      products: sale.products.length || '',
      profit: sale.profit || 'Income:',
      income: sale.income,
      user: sale.user.email,
    })
  );

  // Harvests

  const harvests = await HarvestModel.find(
    userId !== 'all'
      ? {
          user: { $eq: userId },
        }
      : {}
  ).populate('user', 'email');

  harvests.forEach((harvest) =>
    harvestsSheet.addRow({
      date: harvest.date,
      produce: harvest.produce.length,
      user: harvest.user.email,
    })
  );

  productsSheet.columns.forEach((column) => {
    const lengths = column.values.map((v) => v.toString().length);
    column.width = Math.max(...lengths.filter((v) => typeof v === 'number'));
  });

  salesSheet.columns.forEach((column) => {
    const lengths = column.values.map((v) => v.toString().length);
    column.width = Math.max(...lengths.filter((v) => typeof v === 'number'));
  });

  harvestsSheet.columns.forEach((column) => {
    const lengths = column.values.map((v) => v.toString().length);
    column.width = Math.max(...lengths.filter((v) => typeof v === 'number'));
  });

  workbook.xlsx
    .writeFile(path.join(process.cwd(), 'temp', fileName))
    .then(() => {
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=' + fileName
      );
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64'
      );
      response.status(200).download(path.join(process.cwd(), 'temp', fileName));
    });
};

module.exports = {
  exportAllData,
  exportUsers,
  exportProducts,
  exportSales,
  exportHarvests,
};
