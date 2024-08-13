const mongoose = require('mongoose');

const PitchUsModel = mongoose.model("ContactUS", new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone:{ type: String, required: false },
    CompanyName :{type: String, required: false },
    country:{type: String, required: false},
    message:{type: String, required: false}
    
}));

module.exports = PitchUsModel;
