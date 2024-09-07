import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ngoName: '',
    contactPhone: '',
    contactEmail: '',
    fieldOfWork: '',
    regions: [],
    ngoType: [],
    registeredOfficeAddress: '',
    moa: '',
    financialDetails: '',
    disasterHelp: '',
    noc: '',
    helpMode: [],
  });

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedNgoTypes, setSelectedNgoTypes] = useState([]);
  const [selectedHelpModes, setSelectedHelpModes] = useState([]);

  const regionOptions = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir'
  ];

  const ngoTypeOptions = [
    'Educational NGO', 'Health NGO', 'Women Empowerment NGO', 'Child Welfare NGO',
    'Environment NGO', 'Animal Welfare NGO', 'Human Rights NGO', 'Disaster Relief NGO',
    'Senior Citizens NGO', 'Community Development NGO', 'Rural Development NGO',
    'Agriculture NGO', 'Art & Culture NGO', 'Youth NGO', 'Research & Development NGO',
    'Microfinance NGO', 'Sports NGO', 'Poverty Alleviation NGO', 'Slum Development NGO',
    'Tribal Welfare NGO', 'Water & Sanitation NGO', 'HIV/AIDS Awareness NGO',
    'Disabled Persons NGO', 'Labor & Employment NGO', 'Science & Technology NGO',
    'Legal Awareness & Aid NGO'
  ];

  const helpModeOptions = [
    'Food', 'Water', 'Helicopter', 'Shelter', 'Medical Aid', 'Clothing',
    'Rescue Teams', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (e, field) => {
    const options = e.target.options;
    const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
    const existingValues = formData[field] || [];
    const newValues = [...existingValues, ...selectedValues.filter(value => !existingValues.includes(value))];
    setFormData({
      ...formData,
      [field]: newValues,
    });
    if (field === 'regions') {
      setSelectedRegions(newValues);
    } else if (field === 'ngoType') {
      setSelectedNgoTypes(newValues);
    } else if (field === 'helpMode') {
      setSelectedHelpModes(newValues);
    }
  };

  const handleRemove = (field, item) => {
    const updatedSelection = formData[field].filter(option => option !== item);
    setFormData({
      ...formData,
      [field]: updatedSelection,
    });
    if (field === 'regions') {
      setSelectedRegions(updatedSelection);
    } else if (field === 'ngoType') {
      setSelectedNgoTypes(updatedSelection);
    } else if (field === 'helpMode') {
      setSelectedHelpModes(updatedSelection);
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    try {
      const url = isLogin ? 'http://localhost:5000/api/ngos/login' : 'http://localhost:5000/api/ngos/createngo';
      const response = isLogin? await axios.get(url,formDataToSend,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }):await axios.post(url, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  return (
    <div className='auth-form-container'>
      <h1 className='auth-form-title'>{isLogin ? 'NGO Login' : 'NGO Registration'}</h1>
      <form onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            <div className='form-group'>
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Login</button>
            <p className="toggle-link">
              Don't have an account? <button type="button" onClick={() => setIsLogin(false)}>Create one</button>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor="ngoName">Name of NGO:</label>
                    <input 
                        type="text" 
                        id="ngoName"
                        name="ngoName" 
                        className='form-input'
                        value={formData.ngoName} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div className='form-group'>
                    <label>Contact Info:</label>
                    <div className='form-group'>
                        <label htmlFor="contactPhone">Phone:</label>
                        <input 
                            type="tel" 
                            id="contactPhone"
                            name="contactPhone" 
                            className='form-input'
                            value={formData.contactPhone} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="contactEmail">Email:</label>
                        <input 
                            type="email" 
                            id="contactEmail"
                            name="contactEmail" 
                            className='form-input'
                            value={formData.contactEmail} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password" 
                            className='form-input'
                            value={formData.password} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor="fieldOfWork">Field of Work:</label>
                    <input 
                        type="text" 
                        id="fieldOfWork"
                        name="fieldOfWork" 
                        className='form-input'
                        value={formData.fieldOfWork} 
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className='form-group'>
                    <label>Region of Activity:</label>
                    <div className='selected-options'>
                        {selectedRegions.map((region, index) => (
                            <div key={index} className='selected-option'>
                                {region}
                                <button 
                                    type='button' 
                                    className='remove-btn'
                                    onClick={() => handleRemove('regions', region)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <select 
                        id="regions"
                        name="regions" 
                        className='form-select'
                        multiple={true} 
                        value={formData.regions} 
                        onChange={(e) => handleMultiSelectChange(e, 'regions')}
                        required
                    >
                        {regionOptions.map((region, index) => (
                            <option key={index} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
                <div className='form-group'>
                    <label>Type of NGO:</label>
                    <div className='selected-options'>
                        {selectedNgoTypes.map((type, index) => (
                            <div key={index} className='selected-option'>
                                {type}
                                <button 
                                    type='button' 
                                    className='remove-btn'
                                    onClick={() => handleRemove('ngoType', type)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <select 
                        id="ngoType"
                        name="ngoType" 
                        className='form-select'
                        multiple={true} 
                        value={formData.ngoType} 
                        onChange={(e) => handleMultiSelectChange(e, 'ngoType')}
                        required
                    >
                        {ngoTypeOptions.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className='form-group'>
                    <label>Help Mode (Select multiple):</label>
                    <div className='selected-options'>
                        {selectedHelpModes.map((mode, index) => (
                            <div key={index} className='selected-option'>
                                {mode}
                                <button 
                                    type='button' 
                                    className='remove-btn'
                                    onClick={() => handleRemove('helpMode', mode)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <select 
                        id="helpMode"
                        name="helpMode" 
                        className='form-select'
                        multiple={true} 
                        value={formData.helpMode} 
                        onChange={(e) => handleMultiSelectChange(e, 'helpMode')}
                        required
                    >
                        {helpModeOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor="registeredOfficeAddress">Registered Office Address:</label>
                    <input 
                        type="text" 
                        id="registeredOfficeAddress"
                        name="registeredOfficeAddress" 
                        className='form-input'
                        value={formData.registeredOfficeAddress} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="moa">Memorandum of Association (MOA):</label>
                    <input 
                        type="file" 
                        id="moa"
                        name="moa" 
                        className='form-file'
                        onChange={handleFileChange} 
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="financialDetails">Financial Details (Max Support):</label>
                    <input 
                        type="text" 
                        id="financialDetails"
                        name="financialDetails" 
                        className='form-input'
                        value={formData.financialDetails} 
                        onChange={handleChange} 
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="disasterHelp">How can you help in disaster:</label>
                    <input 
                        type="text" 
                        id="disasterHelp"
                        name="disasterHelp" 
                        className='form-input'
                        value={formData.disasterHelp} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="noc">NOC:</label>
                    <input 
                        type="file" 
                        id="noc"
                        name="noc" 
                        className='form-file'
                        onChange={handleFileChange} 
                    />
                </div>
                <button type="submit" className='submit-btn'>Submit</button>
            </form>
          </>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
