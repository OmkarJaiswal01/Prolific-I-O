const mongoose = require('mongoose');

const UnverifiedUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  aws: { type: String, required: false },
  verificationToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // auto delete after 24h
});

const UnverifiedUser = mongoose.model('UnverifiedUser', UnverifiedUserSchema);

module.exports = UnverifiedUser;
