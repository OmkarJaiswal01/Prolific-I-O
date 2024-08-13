const mongoose = require('mongoose');

const SpackWithSalesModel = mongoose.model("SpackWithSales", new mongoose.Schema({
    frist_name: { type: String, required: true },
    last_name: { type: String, required: true },
    title: { type: String, required: true },
    company_name: { type: String, required: true },
    business_email: { type: String, required: true },
    country: { type: String, required: true },
    business_phone: { type: String, required: true },
    comment: { type: String, required: true },
    
}));

module.exports = SpackWithSalesModel;
