const express = require('express');
const router = express.Router();
const FeedParser = require('feedparser');
const request = require('request');
const cron = require('node-cron');

// List of RSS feed URLs
const rssUrls = [
    'https://www.news18.com/commonfeeds/v1/eng/rss/india.xml',
    'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
    'https://timesofindia.indiatimes.com/rssfeedmostrecent.cms',
    'https://zeenews.india.com/rss/india-national-news.xml',
    'https://zeenews.india.com/rss/science-environment-news.xml',
    'https://zeenews.india.com/rss/india-news.xml',
    'https://feeds.feedburner.com/ndtvnews-india-news',
];

// Disaster-related keywords
const disasterKeywords = [
    "earthquake", "flood", "landslide", "cyclone", "hurricane", "tornado",
    "tsunami", "volcano", "wildfire", "drought", "storm", "avalanche",
    "explosion", "fire", "collapse", "chemical spill", "radiation leak",
    "gas leak", "oil spill", "disaster", "emergency", "evacuation",
    "crisis", "rescue operation", "relief effort", "casualties", "damage",
    "aftermath", "disruption", "pandemic", "outbreak", "epidemic",
    "contamination", "quarantine", "environmental damage",
    "ecological disaster"
];

const urgencyDangerKeywords = [
    "urgent", "danger", "severe", "imminent", "extreme",
    "life-threatening", "hazard", "risk", "alert",
    "warning", "catastrophic"
];

const isDisasterRelated = (title, description) => {
    // Ensure title and description are not null or undefined
    if (!title || !description) {
        return false; // If either is missing, consider it not disaster-related
    }


    const lowerTitle = title.toLowerCase();
    const lowerDescription = description.toLowerCase();

    const disasterRelated = disasterKeywords.some(keyword => lowerTitle.includes(keyword) || lowerDescription.includes(keyword));
    const urgentDangerRelated = urgencyDangerKeywords.some(keyword => lowerTitle.includes(keyword) || lowerDescription.includes(keyword));

    return disasterRelated && urgentDangerRelated;
};

let cachedEntries = [];
let lastFetch = Date.now();

const fetchRSSFeeds = async () => {
    const entries = [];
    try {
        for (const rssUrl of rssUrls) {
            const feedparser = new FeedParser();
            const reqStream = request(rssUrl);

            reqStream.pipe(feedparser);

            feedparser.on('readable', () => {
                let stream = feedparser;
                let item;

                while (item = stream.read()) {
                    const { title, description, link } = item;

                    if (isDisasterRelated(title, description)) {
                        entries.push({ title, link, description });
                    }
                }
            });

            await new Promise((resolve, reject) => {
                feedparser.on('end', resolve);
                reqStream.on('error', reject);
            });
        }

        cachedEntries = entries;
        lastFetch = Date.now();
    } catch (error) {
        console.error('Failed to fetch RSS feeds:', error);
    }
};

fetchRSSFeeds();
cron.schedule('*/10 * * * *', fetchRSSFeeds);

router.get('/', (req, res) => {
    res.json({ entries: cachedEntries, lastFetch });
});

module.exports = router;
