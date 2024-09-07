import React, { useState, useEffect } from 'react';
import './rss-feed.css';
function RssFeed() {
  const [rssFeeds, setRssFeeds] = useState([]);

  useEffect(() => {
    const fetchRssFeeds = () => {
      fetch('http://localhost:5000/rss')
        .then(response => response.json())
        .then(data => setRssFeeds(data.entries))
        .catch(error => console.error(error));
    };

    fetchRssFeeds(); // Fetch immediately on mount

    // Set an interval to fetch every 30 seconds (30000 milliseconds)
    const interval = setInterval(fetchRssFeeds, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rss-feed-container">
    <h1>RSS Feeds</h1>
    <ul className="rss-feed-list">
      {rssFeeds.map((feed, index) => (
        <li key={index}>
          <a href={feed.link}>{feed.title}</a>
        </li>
      ))}
    </ul>
  </div>
  );
}

export default RssFeed;
