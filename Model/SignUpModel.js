const mongoose = require('mongoose');

const SignUpModel = mongoose.model("Prolific", new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    aws: { type: String, required: false },
}));

module.exports = SignUpModel;
