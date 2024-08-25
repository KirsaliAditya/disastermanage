const mongoose = require("mongoose");
const { Schema } = mongoose;

const NGOSchema = new Schema({
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'ngo' },
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    contactnumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    type_of_ngo: { type: String , required: true},
    MoA_image: { type: String , required: true},
    field_of_work: { type: String , required: true},
    office_address: { type: String , required: true},
    financial_details: { type: Number , required: true},
    help_mode: { type: String , required: true},
    createdAt: { type: Date, default: Date.now }
});

const NGO = mongoose.model('ngo', NGOSchema);
module.exports = NGO;
