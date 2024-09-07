import React, { useState } from 'react';
import axios from 'axios';
import './DisasterForm.css'; // Import the CSS file

const DisasterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    description: '',
    severity: '',
    injuries: '',
    required_assistance: [],
  });

  const [error, setError] = useState('');
  const [useLiveLocation, setUseLiveLocation] = useState(false);
  const { name, type, location, description, severity, injuries, required_assistance } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prevFormData => {
      const existingValues = new Set(prevFormData.required_assistance);
      selectedValues.forEach(value => existingValues.add(value));
      return { ...prevFormData, required_assistance: Array.from(existingValues) };
    });
  };

  const handleRemove = (item) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      required_assistance: prevFormData.required_assistance.filter(option => option !== item)
    }));
  };

  const handleLocationToggle = () => {
    setUseLiveLocation(prevState => {
      if (prevState) {
        // If switching from live to manual location, clear the location field
        setFormData({ ...formData, location: '' });
      }
      return !prevState;
    });
  };

  const fetchLiveLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const liveLocationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData({ ...formData, location: liveLocationURL });
      }, (err) => {
        setError('Unable to retrieve your location');
        console.error(err);
      });
    } catch (error) {
      setError('Error fetching live location');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/disasters/createdisaster', formData);
      console.log('Disaster reported successfully:', response.data);
    } catch (error) {
      console.error('Error reporting disaster:', error);
      setError('Error reporting disaster');
    }
  };

  const assistanceOptions = ['Food', 'NDRF Team', 'Shelter', 'Medical', 'Evacuation', 'Other'];

  return (
    <div className="container">
      <h2>Report a Disaster</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Type</label>
          <input type="text" name="type" value={type} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Location (Address or Coordinates)</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={handleChange}
            disabled={useLiveLocation}
            required
          />
          <div className="button-group">
            <button type="button" onClick={handleLocationToggle}>
              {useLiveLocation ? 'Use Manual Location' : 'Use Live Location'}
            </button>
            {useLiveLocation && (
              <button type="button" onClick={fetchLiveLocation}>
                Fetch Live Location
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Severity</label>
          <input type="text" name="severity" value={severity} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Injuries (Count)</label>
          <input type="number" name="injuries" value={injuries} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Required Assistance:</label>
          <div className="selected-options">
            {required_assistance.map((assistance, index) => (
              <div key={index} className="selected-option">
                {assistance}
                <button type="button" className="remove-btn" onClick={() => handleRemove(assistance)}>
                  X
                </button>
              </div>
            ))}
          </div>
          <select
            multiple
            name="required_assistance"
            className="form-select"
            value={required_assistance}
            onChange={handleMultiSelectChange}
            required
          >
            {assistanceOptions.map((assistance, index) => (
              <option key={index} value={assistance}>
                {assistance}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DisasterForm;
