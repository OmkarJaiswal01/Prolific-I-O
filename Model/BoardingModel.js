const mongoose = require('mongoose');

const BoardingModel = mongoose.model("Boarding", new mongoose.Schema({
    name: { type: String, required: true },
    OrganisationName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false }, // Make phone field not mandatory
}));

module.exports = BoardingModel;
