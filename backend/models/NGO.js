const mongoose = require("mongoose");
const { Schema } = mongoose;

const NGOSchema = new Schema({
    name: { type: String, required: true },
    contactPhone: { type: String, required: true, unique: true },
    contactEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fieldOfWork: { type: String, required: true },
    regions: { type: [String], required: true }, // Array of strings for selected regions
    ngoType: { type: [String], required: true }, // Array of strings for selected NGO types
    registeredOfficeAddress: { type: String, required: true },
    moa: { type: String, required: true }, // Store file path or file name
    financialDetails: { type: String },
    disasterHelp: { type: String, required: true },
    emergencyPerson: { type: String },
    emergencyPosition: { type: String },
    noc: { type: String }, // Store file path or file name
    helpMode: { type: [String], required: true }, // Array of strings for help modes
    createdAt: { type: Date, default: Date.now }
});

const NGO = mongoose.model("NGO", NGOSchema);
module.exports = NGO;
