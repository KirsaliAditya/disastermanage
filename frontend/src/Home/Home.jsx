import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import RSSFeed from '../rss-feed/rssfeed';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Slider from 'react-slick'; // Import the Slider component from react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// Import images
import cloudburstImage from '../DisasterPhotos/1.jpg';
import floodImage from '../DisasterPhotos/2.jpg';
import landslideImage from '../DisasterPhotos/3.jpg';
import tsunamiImage from '../DisasterPhotos/4.jpg';
import earthquakeImage from '../DisasterPhotos/5.jpg';
import chemicalExplosionImage from '../DisasterPhotos/6.jpg';

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [scrapedData, setScrapedData] = useState([]);
  const [disasterStats, setDisasterStats] = useState({});
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/scraper/scrapedData', {
        params: { page, limit: 10 }
      });
      setScrapedData(prevData => [...prevData, ...response.data.articles]);
      setTotalArticles(response.data.totalArticles);

      // Calculate disaster stats
      const stats = response.data.articles.reduce((acc, article) => {
        const types = extractDisasterTypes(article.content); // Extract types from content
        types.forEach(type => {
          acc[type] = (acc[type] || 0) + 1;
        });
        return acc;
      }, {});
      setDisasterStats(stats);
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

  const extractDisasterTypes = (content) => {
    const types = [];
    if (content.toLowerCase().includes('cloudburst')) types.push('Cloudburst');
    if (content.toLowerCase().includes('flood')) types.push('Flood');
    if (content.toLowerCase().includes('landslide')) types.push('Landslide');
    if (content.toLowerCase().includes('tsunami')) types.push('Tsunami');
    if (content.toLowerCase().includes('earthquake')) types.push('Earthquake');
    if (content.toLowerCase().includes('chemical explosion')) types.push('Chemical Explosion');
    // Add other types as needed
    return types;
  };

  const chartData = {
    labels: Object.keys(disasterStats),
    datasets: [
      {
        label: 'Number of Incidents',
        data: Object.values(disasterStats),
        backgroundColor: ['#e85009', '#f3722c', '#ff9f00', '#00bfae', '#0077ff', '#ff006e'],
        borderColor: '#ffffff',
        borderWidth: 1,
      }
    ]
  };

  // Map disaster types to images
  const disasterImages = [
    cloudburstImage,
    floodImage,
    landslideImage,
    tsunamiImage,
    earthquakeImage,
    chemicalExplosionImage,
  ];

  // Settings for the carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Adjust the speed to change how long each image stays
  };

  return (
    <div className="home">
      <header className="home-top">
        <h1>Welcome to ResQAction</h1>
      </header>
      <main className="home-content">
        <section className="latest-news">
          <h2>Latest News</h2>
          <RSSFeed />
        </section>
        <section className="photos-space">
          <h2>Disaster Photos</h2>
          <Slider {...carouselSettings}>
            {disasterImages.map((image, index) => (
              <div key={index} className="carousel-slide">
                <img src={image} alt={`Disaster ${index}`} />
              </div>
            ))}
          </Slider>
        </section>
        <section className="visual-container">
          <h2 className="visual-description">Recent Disaster Statistics in India</h2>
          <div className="stats-donut">
            <Doughnut data={chartData} />
          </div>
        </section>
      </main>
      <div className="scraped-data-section">
        <h2>Scraped Data</h2>
        {scrapedData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <div className="scraped-data-grid">
            {scrapedData.slice(0, 10).map((item, index) => (
              <div key={index} className="card">
                <h3>{item.title}</h3>
                <p>{item.content.length > 100 ? `${item.content.slice(0, 100)}...` : item.content}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer">Read more</a>
                <p className="scraped-time">{new Date(item.dateScraped).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
        {scrapedData.length < totalArticles && (
          <button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
