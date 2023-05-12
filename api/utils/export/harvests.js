let path = require('path');
let ExcelJS = require('exceljs');
let moment = require('moment');
const HarvestModel = require('../../models/harvest');

const exportHarvests = async (request, response, next) => {
  const fileName = request.query.fileName
    ? request.query.fileName + '.xlsx'
    : 'harvests.data.' + moment(Date.now()).format('DD-MM-YYYY') + '.xlsx';

  let workbook = new ExcelJS.Workbook();

  workbook.creator = 'Purpose360';
  workbook.lastModifiedBy = 'Purpose360 API';
  workbook.created = new Date();
  workbook.modified = new Date();

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

  const harvests = await HarvestModel.find({
    userType: { $ne: 'admin' },
  }).populate('user', 'email');

  harvests.forEach((harvest) => {
    harvestsSheet.addRow({
      date: harvest.date,
      produce: harvest.produce.length,
      user: harvest.user.email,
    });
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

module.exports = exportHarvests;
