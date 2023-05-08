let fs = require('fs');
let path = require('path');
let ExcelJS = require('exceljs');
let moment = require('moment');
const { v4 } = require('uuid');
const UserModel = require('../../models/user');
const userFormatter = require('../userFormatter');
const ProductModel = require('../../models/product');
const SaleModel = require('../../models/sale');
const ProduceModel = require('../../models/produce');
const HarvestModel = require('../../models/harvest');

const exportSales = async (request, response, next) => {
  const fileName = request.query.fileName
    ? request.query.fileName + '.xlsx'
    : 'sales.data.' + moment(Date.now()).format('DD-MM-YYYY') + '.xlsx';

  let workbook = new ExcelJS.Workbook();

  workbook.creator = 'Purpose360';
  workbook.lastModifiedBy = 'Purpose360 API';
  workbook.created = new Date();
  workbook.modified = new Date();

  let salesSheet = workbook.addWorksheet('Sales', {
    headerFooter: { firstHeader: 'Date' },
  });

  const salesColumns = [
    { header: 'Date', key: 'date' },
    { header: 'Products Sold', key: 'products' },
    { header: 'Profit (R)', key: 'profit' },
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

  const sales = await SaleModel.find({ userType: { $ne: 'admin' } }).populate(
    'user',
    'email'
  );

  sales.forEach((sale) => {
    salesSheet.addRow({
      date: sale.date,
      products: sale.products.length,
      profit: sale.profit,
      user: sale.user.email,
    });
  });

  salesSheet.columns.forEach((column) => {
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

module.exports = exportSales;
