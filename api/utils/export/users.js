let fs = require('fs');
let path = require('path');
let ExcelJS = require('exceljs');
let moment = require('moment');
const { v4 } = require('uuid');
const UserModel = require('../../models/user');
const userFormatter = require('../userFormatter');

const exportUsers = async (request, response, next) => {
  const fileName = request.query.fileName
    ? request.query.fileName + '.xlsx'
    : 'users.data.' + moment(Date.now()).format('DD-MM-YYYY') + '.xlsx';

  let workbook = new ExcelJS.Workbook();

  workbook.creator = 'Purpose360';
  workbook.lastModifiedBy = 'Purpose360 API';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Users

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
    { header: 'Number of School Kids', key: 'numberOfSchoolKids' },
    { header: 'Number of Staff/Teachers', key: 'numberOfStaff' },
    { header: 'Has Gardener', key: 'hasGardener' },
    { header: 'Number Of Classrooms', key: 'numberOfClassrooms' },
    { header: 'Land Owner', key: 'landOwner' },
    { header: 'Garden In Progress', key: 'hasGardenInProgress' },
    { header: 'Growing Crops', key: 'isGrowingCrops' },
    { header: 'Garden Size', key: 'gardenSize' },
    { header: 'Number of Toilets', key: 'numberOfToilets' },
    { header: 'First Aid Trained', key: 'isFirstAidTrained' },
    { header: 'Fire Extinguisher Available', key: 'isFireExtinguisherAvailable' },
    { header: 'Has Internet Access', key: 'hasInternetAccess' },
    { header: 'Has First Aid on Site', key: 'hasFirstAidOnSite' },
    { header: 'Number of Fridges', key: 'numberOfFridges' },
    { header: 'Number of Water Tanks', key: 'numberOfWaterTanks' },
    { header: 'Food From', key: 'foodFrom' },
    { header: 'Working Lights and Electricity', key: 'hasWorkingLightsAndElectricity' },
    { header: 'Has Running Water', key: 'hasRunningWater' },
    { header: 'Has Stove or Oven', key: 'hasStoveOrOven' },
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

  const users = await UserModel.find({ userType: { $ne: 'admin' }, userGroup: { $eq: request.user.userGroup } });

  users.forEach((user) => usersSheet.addRow(userFormatter(user.toJSON())));

  usersSheet.columns.forEach((column) => {
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

module.exports = exportUsers;
