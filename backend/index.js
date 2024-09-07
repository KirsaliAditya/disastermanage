const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads folder
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/ngos', require('./routes/ngo'));
app.use('/api/disasters', require('./routes/disaster'));
//app.use('/api/chatbot', require('./routes/chatbot')); // Existing routes
app.use('/api/scraper', require('./routes/scraper')); // Use combined scraper route
app.use('/api/excel', require('./routes/excelData')); // New Excel data route

app.listen(port, () => {
  console.log(`Disaster Management backend listening on port http://localhost:${port}`);
});
