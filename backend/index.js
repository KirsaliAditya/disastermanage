const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');


connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ngos', require('./routes/ngo'));
app.use('/api/disasters', require('./routes/disaster'));

app.listen(port, () => {
  console.log(`Disaster Management backend listening on port http://localhost:${port}`);
});

