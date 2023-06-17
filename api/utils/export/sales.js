let fs = require('fs');
let path = require('path');
let ExcelJS = require('exceljs');
let moment = require('moment');
const { v4 } = require('uuid');
const SaleModel = require('../../models/sale');

const exportSales = async (request, response, next) => {
  const userId = request.params.userId || 'all';
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

  let sales = await SaleModel.find(
    userId !== 'all'
      ? {
          user: { $eq: userId },
        }
      : {}
  ).populate('user');

  if (userId === "all") sales = sales.filter((sale) => sale.user.userGroup === request.user.userGroup);

  sales.forEach((sale) => {
    salesSheet.addRow({
      date: sale.date,
      products: sale.products.length || '',
      profit: sale.profit || 'Income:',
      income: sale.income,
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
