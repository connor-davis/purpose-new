let path = require('path');
let ExcelJS = require('exceljs');
let moment = require('moment');
const ProductModel = require('../../models/product');
const UserModel = require('../../models/user');

const exportProducts = async (request, response, next) => {
  const fileName = request.query.fileName
    ? request.query.fileName + '.xlsx'
    : 'products.data.' + moment(Date.now()).format('DD-MM-YYYY') + '.xlsx';

  let workbook = new ExcelJS.Workbook();

  workbook.creator = 'Purpose360';
  workbook.lastModifiedBy = 'Purpose360 API';
  workbook.created = new Date();
  workbook.modified = new Date();

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

  const products = await ProductModel.find({
    userType: { $ne: 'admin' },
  }).populate('user', 'email');

  products.forEach((product) => {
    productsSheet.addRow({
      name: product.name,
      cost: product.cost,
      price: product.price,
      user: product.user.email,
    });
  });

  productsSheet.columns.forEach((column) => {
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

module.exports = exportProducts;
