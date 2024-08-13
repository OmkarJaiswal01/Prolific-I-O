const mongoose = require('mongoose');

const CformSchema = new mongoose.Schema({
  name: { type: String, required: false},
  email: { type: String, required: false},
  contactNumber: { type: String, required: false},
  companyName: { type: String }  // Removed required: true
});

const CformModel = mongoose.model('Cform', CformSchema);

module.exports = CformModel;
