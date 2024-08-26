import React, { useState } from 'react';
import axios from 'axios';
import './NGO.css';

const NgoRegistrationForm = () => {
    const [formData, setFormData] = useState({
        ngoName: '',
        contactPhone: '',
        contactEmail: '',
        password: '',
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
        }
        else if(field === 'helpMode') {
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
        }
        else if(field === 'helpMode') {
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
            const response = await axios.post('http://localhost:5000/api/ngos/createngo', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data.message);
        } catch (error) {
            console.error('There was an error submitting the form!', error);
        }
    };

    return (
        <div className='form-container'>
            <h1>NGO Registration Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name of NGO:</label>
                    <input 
                        type="text" 
                        name="ngoName" 
                        value={formData.ngoName} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div>
                    <label>Contact Info:</label>
                    <div>
                        <label>Phone:</label>
                        <input 
                            type="tel" 
                            name="contactPhone" 
                            value={formData.contactPhone} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="contactEmail" 
                            value={formData.contactEmail} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                </div>
                <div>
                    <label>Field of Work:</label>
                    <input 
                        type="text" 
                        name="fieldOfWork" 
                        value={formData.fieldOfWork} 
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div>
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
                        name="regions" 
                        multiple={true} 
                        required
                        value={formData.regions} 
                        onChange={(e) => handleMultiSelectChange(e, 'regions')}
                    >
                        {regionOptions.map((region, index) => (
                            <option key={index} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
                <div>
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
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                    <select 
                        name="ngoType" 
                        multiple={true} 
                        required
                        value={formData.ngoType} 
                        onChange={(e) => handleMultiSelectChange(e, 'ngoType')}
                    >
                        {ngoTypeOptions.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
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
                                x
                            </button>
                        </div>
                    ))}
                </div>
                <select 
                    name="helpMode" 
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
                <div>
                    <label>Registered Office Address:</label>
                    <input 
                        type="text" 
                        name="registeredOfficeAddress" 
                        value={formData.registeredOfficeAddress} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div>
                    <label>Memorandum of Association (MOA):</label>
                    <input 
                        type="file" 
                        name="moa" 
                        onChange={handleFileChange} 
                        required
                    />
                </div>
                <div>
                    <label>Financial Details (Max Support):</label>
                    <input 
                        type="text" 
                        name="financialDetails" 
                        value={formData.financialDetails} 
                        onChange={handleChange} 
                    />
                </div>
                <div>
                    <label>How can you help in disaster:</label>
                    <input 
                        type="text" 
                        name="disasterHelp" 
                        value={formData.disasterHelp} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div>
                    <label>NOC:</label>
                    <input 
                        type="file" 
                        name="noc" 
                        onChange={handleFileChange} 
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};


export default NgoRegistrationForm;
