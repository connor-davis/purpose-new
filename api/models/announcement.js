const mongoose = require('mongoose');
const AnnouncementSchema = require('../schemas/announcement');

const AnnouncementModel = mongoose.model('Announcement', AnnouncementSchema);

module.exports = AnnouncementModel;
