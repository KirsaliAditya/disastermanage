import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './rss-feed.css';

function RSSFeed() {
  const [rssFeeds, setRssFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRSSFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rss');
        setRssFeeds(response.data.entries);
        setLoading(false);
      } catch (error) {
        setError('Error fetching RSS feeds');
        setLoading(false);
      }
    };

    fetchRSSFeeds();
    const interval = setInterval(fetchRSSFeeds, 500);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="rss-feed-container">
      <ul className="rss-feed-list">
        {rssFeeds.length > 0 ? (
          rssFeeds.map((feed, index) => (
            <li key={index}>
              <a href={feed.link} target="_blank" rel="noopener noreferrer">{feed.title}</a>
              <p>{feed.description.length > 50 ? `${feed.description.slice(0, 50)}...` : feed.description}</p>
            </li>
          ))
        ) : (
          <li>No RSS feeds available</li>
        )}
      </ul>
    </div>
  );
}

export default RSSFeed;
