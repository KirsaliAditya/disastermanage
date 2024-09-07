const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');

router.post('/createdisaster', async (req, res) => {
    try {
        const { name, type, location, description, severity, injuries, required_assistance, liveLocation } = req.body;
        
        // Create a new disaster report
        const disaster = new Disaster({
            name,
            type,
            location,
            description,
            severity,
            injuries,
            required_assistance,
            liveLocation  // Store live location link
        });

        await disaster.save();
        res.status(201).json({ message: 'Disaster created successfully', disaster });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/getdisasters', async (req, res) => {
    try {
        const disasters = await Disaster.find();
        res.status(200).json(disasters);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/getdisaster/:id', async (req, res) => {
    try {
        const disaster = await Disaster.findById(req.params.id);
        if (!disaster) {
            return res.status(404).json({ message: 'Disaster not found' });
        }

        res.status(200).json(disaster);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.put('/editdisaster/:id', async (req, res) => {
    try {
        const { name, type, location, description, severity, injuries, required_assistance, liveLocation } = req.body;

        let disaster = await Disaster.findById(req.params.id);
        if (!disaster) {
            return res.status(404).json({ message: 'Disaster not found' });
        }

        // Update the disaster fields
        disaster.name = name || disaster.name;
        disaster.type = type || disaster.type;
        disaster.location = location || disaster.location;
        disaster.description = description || disaster.description;
        disaster.severity = severity || disaster.severity;
        disaster.injuries = injuries || disaster.injuries;
        disaster.required_assistance = required_assistance || disaster.required_assistance;
        disaster.liveLocation = liveLocation || disaster.liveLocation;

        await disaster.save();
        res.status(200).json({ message: 'Disaster updated successfully', disaster });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/deletedisaster/:id', async (req, res) => {
    try {
        const result = await Disaster.deleteOne({ _id: req.params.id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Disaster not found' });
        }

        res.status(200).json({ message: 'Disaster deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
