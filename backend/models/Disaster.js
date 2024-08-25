const mongoose = require("mongoose");
const { Schema } = mongoose;

const DisasterSchema = new Schema({
    disaster: { type: mongoose.Schema.Types.ObjectId, ref: 'disaster' },
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
    createdAt: { type: Date, default: Date.now }
});

const Disaster = mongoose.model('disaster', DisasterSchema);
module.exports = Disaster;
