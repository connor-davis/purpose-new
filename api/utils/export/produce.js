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

const exportProduce = async (request, response, next) => {
  const fileName = request.query.fileName
    ? request.query.fileName + '.xlsx'
    : 'produce.data.' + moment(Date.now()).format('DD-MM-YYYY') + '.xlsx';

  let workbook = new ExcelJS.Workbook();

  workbook.creator = 'Purpose360';
  workbook.lastModifiedBy = 'Purpose360 API';
  workbook.created = new Date();
  workbook.modified = new Date();

  let produceSheet = workbook.addWorksheet('Produce', {
    headerFooter: { firstHeader: 'Name' },
  });

  const produceColumns = [
    { header: 'Name', key: 'name' },
    { header: 'Price (R)', key: 'price' },
    { header: 'User', key: 'user' },
  ];

  produceSheet.columns = produceColumns;

  produceSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '#171717' },
    bgColor: { argb: '#171717' },
  };
  produceSheet.getRow(1).border = {
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
  produceSheet.getRow(1).font = {
    color: { argb: '#FFFFFF' },
  };

  const produce = await ProduceModel.find({
    userType: { $ne: 'admin' },
  }).populate('user', 'email');

  produce.forEach((produce) => {
    produceSheet.addRow({
      name: produce.name,
      price: produce.price,
      user: produce.user.email,
    });
  });

  produceSheet.columns.forEach((column) => {
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

module.exports = exportProduce;
