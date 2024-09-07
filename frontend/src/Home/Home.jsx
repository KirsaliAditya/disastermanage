import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const [scrapedData, setScrapedData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/scraper/scrapedData', {
        params: { page, limit: 10 }
      });
      setScrapedData(response.data.articles);
      setTotalArticles(response.data.totalArticles);
    } catch (error) {
      console.error('Error fetching scraped data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="home">
      <header className="home-top">
        <div className="home-top-content">
          <h1>Welcome to NDRF India</h1>
        </div>
      </header>
      <main className="home-main">
        <section className="home-sidebar">
          <div className="realtime-photos">
            <h2>Real-time Photos</h2>
            {/* Add real-time photo components or content here */}
          </div>
          <div className="news">
            <h2>Latest News</h2>
            {/* Add latest news components or content here */}
          </div>
        </section>
        <section className="home-content">
          <h2>Scraped Data</h2>
          {scrapedData.length === 0 ? (
            <p>No data available</p>
          ) : (
            <div className="scraped-data-grid">
              {scrapedData.slice(0, 10).map((item, index) => (
                <div key={index} className="scraped-card">
                  <h3>{item.title}</h3>
                  <p>{item.content.length > 100 ? item.content.slice(0, 100) + '...' : item.content}</p>
                  <p><a href={item.url} target="_blank" rel="noopener noreferrer">Read more</a></p>
                  <p className="scraped-time">{item.time}</p>
                </div>
              ))}
            </div>
          )}
          {scrapedData.length < totalArticles && (
            <button onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
