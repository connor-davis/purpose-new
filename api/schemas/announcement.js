const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    announcementDate: {
      type: String,
      required: true,
    },
    announcementTitle: {
      type: String,
      required: true,
    },
    announcementMessage: {
      type: String,
      required: true,
    },
    userGroup: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = AnnouncementSchema;
