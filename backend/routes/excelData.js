const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const path = require('path');

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../public_emdat_custom_request_2024-09-02_01ef95b2-7e2f-4bf6-9906-c86e6c24608f.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json(worksheet);
});

module.exports = router;
