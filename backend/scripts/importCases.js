const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Case = require('../models/Case');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nyaya_setu';

async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully.');

    const dataPath = path.join(__dirname, '../data/cases.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at ${dataPath}`);
    }

    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const cases = JSON.parse(fileContent);

    if (!Array.isArray(cases)) {
      throw new Error('JSON data must be an array of case objects.');
    }

    console.log(`Found ${cases.length} cases in JSON file. Starting import...`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const caseData of cases) {
      try {
        const existingCase = await Case.findOne({ 
          $or: [
            { case_number: caseData.case_number },
            { cnr_number: caseData.cnr_number }
          ]
        });

        if (existingCase) {
          console.log(`Skipping duplicate case: ${caseData.case_number} / ${caseData.cnr_number}`);
          skippedCount++;
        } else {
          await Case.create(caseData);
          insertedCount++;
        }
      } catch (err) {
        console.error(`Error inserting case ${caseData.case_number}:`, err.message);
      }
    }

    console.log('--- Import Summary ---');
    console.log(`Total records processed: ${cases.length}`);
    console.log(`Successfully inserted: ${insertedCount}`);
    console.log(`Skipped (duplicates): ${skippedCount}`);

  } catch (error) {
    console.error('Import failed:', error.message);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed.');
    }
    process.exit(0);
  }
}

importData();
