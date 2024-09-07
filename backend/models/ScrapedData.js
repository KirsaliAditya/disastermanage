const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the scraped data
const dataSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  dateScraped: {
    type: Date,
    default: Date.now,
  },
  additionalField1: {
    type: String,
  },
  additionalField2: {
    type: String,
  }
});

// Create the model from the schema
const ScrapedData = mongoose.model('Data', dataSchema);
module.exports = ScrapedData;
