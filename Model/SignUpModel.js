const mongoose = require('mongoose');

const SignUpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  aws: { type: String, required: false },
});

const SignUpModel = mongoose.model('SignUp', SignUpSchema);

module.exports = SignUpModel;
