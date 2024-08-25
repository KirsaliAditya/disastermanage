const express = require('express');
const bcrypt = require('bcryptjs');
const NGO = require('../models/NGO'); // Import the NGO model
const router = express.Router();

// Create a new NGO
router.post('/createngo', async (req, res) => {
    const { name, email, contactnumber, password, type_of_ngo, MoA_image, field_of_work, office_address, financial_details, help_mode } = req.body;

    try {
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new NGO object
        const newNGO = new NGO({
            name,
            email,
            contactnumber,
            password: hashedPassword, // Store the hashed password
            type_of_ngo,
            MoA_image,
            field_of_work,
            office_address,
            financial_details,
            help_mode
        });

        // Save the NGO to the database
        await newNGO.save();
        res.status(201).json({ message: 'NGO created successfully' });
    } catch (error) {
        console.error('Error creating NGO:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit an existing NGO
router.put('/editngo/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, contactnumber, password, type_of_ngo, MoA_image, field_of_work, office_address, financial_details, help_mode } = req.body;

    try {
        // Find the NGO by ID
        const ngo = await NGO.findById(id);
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        // Update fields if provided
        if (name) ngo.name = name;
        if (email) ngo.email = email;
        if (contactnumber) ngo.contactnumber = contactnumber;
        if (type_of_ngo) ngo.type_of_ngo = type_of_ngo;
        if (MoA_image) ngo.MoA_image = MoA_image;
        if (field_of_work) ngo.field_of_work = field_of_work;
        if (office_address) ngo.office_address = office_address;
        if (financial_details) ngo.financial_details = financial_details;
        if (help_mode) ngo.help_mode = help_mode;

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
