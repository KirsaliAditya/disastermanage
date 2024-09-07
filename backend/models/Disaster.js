const mongoose = require("mongoose");
const { Schema } = mongoose;

const DisasterSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, required: true },
    injuries: { type: Number, required: true },
    required_assistance: { 
        type: [String], 
        required: true, 
        enum: ['Food', 'NDRF Team', 'Shelter', 'Medical', 'Evacuation', 'Other'] 
    },
    liveLocation: { type: String }, // New field for live location link
    createdAt: { type: Date, default: Date.now }
});

const Disaster = mongoose.model('disaster', DisasterSchema);
module.exports = Disaster;
