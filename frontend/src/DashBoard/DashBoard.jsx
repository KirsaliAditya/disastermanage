import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashBoard.css';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const Dashboard = () => {
  const [incidentData, setIncidentData] = useState([]);
  const [showSummary, setShowSummary] = useState(false); // State to control summary visibility

  useEffect(() => {
    // Fetch incident data from your API using axios
    axios.get('http://localhost:5000/api/excel')
      .then((response) => {
        setIncidentData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching incident data:', error);
      });
  }, []);

  // Total incidents in each state (for Pie Chart)
  const incidentCountByState = incidentData.reduce((acc, incident) => {
    const states = incident["Location"].split(", ");
    states.forEach((state) => {
      if (!acc[state]) {
        acc[state] = 0;
      }
      acc[state] += 1;
    });
    return acc;
  }, {});

  // Total damage in each state (for Bar Chart)
  const damageByState = incidentData.reduce((acc, incident) => {
    const states = incident["Location"].split(", ");
    states.forEach((state) => {
      if (!acc[state]) {
        acc[state] = 0;
      }
      acc[state] += parseFloat(incident["Total Damage ('000 US$)"]) || 0;
    });
    return acc;
  }, {});

  // Number of Incidents by Year (2011–2024)
  const incidentsByYear = incidentData.reduce((acc, incident) => {
    const startYear = parseInt(incident["Start Year"]); // Ensure it's an integer
    if (startYear && startYear >= 2011 && startYear <= 2024) { // Check for valid year
      if (!acc[startYear]) {
        acc[startYear] = 0;
      }
      acc[startYear] += 1; // Increment the number of incidents for that year
    }
    return acc;
  }, {});

  // Death rate by disaster type (for Bar Chart)
  const deathRateByType = incidentData.reduce((acc, incident) => {
    const type = incident["Disaster Type"];
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += parseInt(incident["Total Deaths"]) || 0;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(incidentCountByState),
    datasets: [
      {
        data: Object.values(incidentCountByState),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#99CCFF',
        ],
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'right', // Position the legend on the right
        labels: {
          boxWidth: 20, // Size of the legend boxes
          font: {
            size: 14, // Font size for legend labels
          },
        },
      },
    },
  };

  const damageBarChartData = {
    labels: Object.keys(damageByState),
    datasets: [
      {
        label: 'Total Damage (\'000 US$)',
        data: Object.values(damageByState),
        backgroundColor: '#FF6384',
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(incidentsByYear),
    datasets: [
      {
        label: 'Number of Incidents',
        data: Object.values(incidentsByYear),
        fill: false,
        borderColor: '#36A2EB',
        pointBackgroundColor: '#FF6384',
      },
    ],
  };

  const deathRateData = {
    labels: Object.keys(deathRateByType),
    datasets: [
      {
        label: 'Total Deaths',
        data: Object.values(deathRateByType),
        backgroundColor: '#FF6384',
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Health & Safety Dashboard</h1>

      <div className="charts">
        <div className="chart-panel">
          <h2>Incidents in Each State</h2>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>

        <div className="chart-panel">
          <h2>Damage in Each State</h2>
          <Bar data={damageBarChartData} />
        </div>

        <div className="chart-panel">
          <h2>Number of Incidents in India (2011–2024)</h2>
          <Line data={lineChartData} />
        </div>

        <div className="chart-panel">
          <h2>Death Rates by Disaster Type</h2>
          <Bar data={deathRateData} />
        </div>
      </div>

      <div className="summary-section">
        <button className="toggle-btn" onClick={() => setShowSummary(!showSummary)}>
          {showSummary ? 'Hide Incident Summary' : 'View Incident Summary'}
        </button>

        {showSummary && (
          <div className="table">
            <h2>Incident Summaries</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Disaster Type</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Total Deaths</th>
                  <th>Total Damage</th>
                </tr>
              </thead>
              <tbody>
                {incidentData.map((incident, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{incident["Disaster Type"]}</td>
                    <td>{incident["Start Date"]}</td>
                    <td>{incident["Location"]}</td>
                    <td>{incident["Total Deaths"]}</td>
                    <td>{incident["Total Damage ('000 US$)"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
