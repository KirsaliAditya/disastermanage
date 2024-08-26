const express = require('express');
const bcrypt = require('bcryptjs');
const NGO = require('../models/NGO');
const upload = require('../middleware/upload'); // Import multer configuration

const router = express.Router();

// Create a new NGO with image uploads
router.post('/createngo', upload.fields([{ name: 'moa' }, { name: 'noc' }]), async (req, res) => {
    const {
        ngoName,
        contactPhone,
        contactEmail,
        password,
        fieldOfWork,
        regions,
        ngoType,
        registeredOfficeAddress,
        financialDetails,
        disasterHelp,
        emergencyPerson,
        emergencyPosition,
        helpMode
    } = req.body;

    try {
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new NGO object
        const newNGO = new NGO({
            name: ngoName,
            contactPhone,
            contactEmail,
            password: hashedPassword, // Store the hashed password
            fieldOfWork,
            regions: JSON.parse(regions), // Parse the array from string
            ngoType: JSON.parse(ngoType), // Parse the array from string
            registeredOfficeAddress,
            financialDetails,
            disasterHelp,
            emergencyPerson,
            emergencyPosition,
            moa: req.files['moa'] ? req.files['moa'][0].filename : null,
            noc: req.files['noc'] ? req.files['noc'][0].filename : null,
            helpMode: JSON.parse(helpMode) // Parse the array from string
        });

        // Save the NGO to the database
        await newNGO.save();
        res.status(201).json({ message: 'NGO created successfully' });
    } catch (error) {
        console.error('Error creating NGO:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit an existing NGO with image uploads
router.put('/editngo/:id', upload.fields([{ name: 'moa' }, { name: 'noc' }]), async (req, res) => {
    const { id } = req.params;
    const {
        ngoName,
        contactPhone,
        contactEmail,
        password,
        fieldOfWork,
        regions,
        ngoType,
        registeredOfficeAddress,
        financialDetails,
        disasterHelp,
        emergencyPerson,
        emergencyPosition,
        helpMode
    } = req.body;

    try {
        // Find the NGO by ID
        const ngo = await NGO.findById(id);
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        // Update fields if provided
        if (ngoName) ngo.name = ngoName;
        if (contactPhone) ngo.contactPhone = contactPhone;
        if (contactEmail) ngo.contactEmail = contactEmail;
        if (fieldOfWork) ngo.fieldOfWork = fieldOfWork;
        if (regions) ngo.regions = JSON.parse(regions);
        if (ngoType) ngo.ngoType = JSON.parse(ngoType);
        if (registeredOfficeAddress) ngo.registeredOfficeAddress = registeredOfficeAddress;
        if (financialDetails) ngo.financialDetails = financialDetails;
        if (disasterHelp) ngo.disasterHelp = disasterHelp;
        if (emergencyPerson) ngo.emergencyPerson = emergencyPerson;
        if (emergencyPosition) ngo.emergencyPosition = emergencyPosition;
        if (helpMode) ngo.helpMode = JSON.parse(helpMode);

        // Update MoA and NOC files if provided
        if (req.files['moa']) ngo.moa = req.files['moa'][0].filename;
        if (req.files['noc']) ngo.noc = req.files['noc'][0].filename;

        // Encrypt and update the password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            ngo.password = await bcrypt.hash(password, salt);
        }

        // Save the updated NGO
        await ngo.save();
        res.status(200).json({ message: 'NGO updated successfully' });
    } catch (error) {
        console.error('Error updating NGO:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an NGO
router.delete('/deletengo/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the NGO by ID and delete it
        const ngo = await NGO.findByIdAndDelete(id);
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }
        res.status(200).json({ message: 'NGO deleted successfully' });
    } catch (error) {
        console.error('Error deleting NGO:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all NGOs
router.get('/getngos', async (req, res) => {
    try {
        const ngos = await NGO.find();
        res.status(200).json(ngos);
    } catch (error) {
        console.error('Error fetching NGOs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single NGO by ID
router.get('/getngo/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ngo = await NGO.findById(id);
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }
        res.status(200).json(ngo);
    } catch (error) {
        console.error('Error fetching NGO:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
