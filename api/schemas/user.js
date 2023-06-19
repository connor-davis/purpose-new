const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    completedProfile: {
      type: Boolean,
      required: true,
      default: false,
    },
    agreedToTerms: {
      type: Boolean,
      required: true,
    },
    userType: {
      type: String,
      required: false,
    },
    userGroup: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    idNumber: {
      type: Number,
      required: false,
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    ethnicity: {
      type: String,
      required: false,
    },
    businessName: {
      type: String,
      required: false,
    },
    businessDescription: {
      type: String,
      required: false,
    },
    positionAtECD: {
      type: String,
      required: false,
    },
    numberOfChildren: {
      type: Number,
      required: false,
    },
    numberOfDependents: {
      type: Number,
      required: false,
    },
    businessRegistered: {
      type: Boolean,
      required: false,
      default: false,
    },
    businessRegistrationNumber: {
      type: String,
      required: false,
    },
    businessNumberOfEmployees: {
      type: Number,
      required: false,
    },
    websiteUrl: {
      type: String,
      required: false,
    },
    facebookPageUrl: {
      type: String,
      required: false,
    },
    instagramPageUrl: {
      type: String,
      required: false,
    },
    youtubeChannelUrl: {
      type: String,
      required: false,
    },
    accountNumber: {
      type: Number,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    bankBranchCode: {
      type: Number,
      required: false,
    },
    streetAddress: {
      type: String,
      required: false,
    },
    suburb: {
      type: String,
      required: false,
    },
    ward: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    areaCode: {
      type: Number,
      required: false,
    },
    province: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = UserSchema;
