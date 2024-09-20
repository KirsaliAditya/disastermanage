const express = require('express');
const { spawn } = require('child_process');
const ScrapedData = require('../models/ScrapedData'); // Assuming this model matches the schema you need
const cron = require('node-cron');

const router = express.Router();

// Function to call the Python scraper and save the data
const scrapeData = async (topic) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['D:/DisasterManagement/disastermanage/scraper/times_scraper.py', topic]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
      reject(data);
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return reject(`Python script exited with code ${code}`);
      }

      const articles = JSON.parse(dataString);
      try {
        // Save each article to MongoDB
        for (const article of articles) {
          await new ScrapedData({
            title: article.title,
            url: article.url,
            label: article.label,
            content: article.content,
            time: article.time,
          }).save();
        }
        resolve('Scraping complete and data saved to MongoDB');
      } catch (error) {
        reject(`Error saving data to MongoDB: ${error}`);
      }
    });
  });
};

// Schedule the scraper to run every 5 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('Running scraper every 5 minutes');
  scrapeData('cloudburst').then(console.log).catch(console.error);
});

// Example of an API route in Express to fetch latest news with pagination

router.get('/scrapedData', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10 items
      const skip = (page - 1) * limit;
  
      const articles = await ScrapedData.find()
        .sort({ _id: -1 }) // Sort by latest first
        .skip(skip)
        .limit(parseInt(limit))
        .exec();
  
      const totalArticles = await ScrapedData.countDocuments(); // Total number of articles
  
      res.json({
        articles,
        totalArticles
      });
    } catch (error) {
      res.status(500).send('Error fetching data: ' + error);
    }
  });
  

module.exports = router;
