import express from 'express';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const app = express();
app.use(express.json()); // For parsing application/json

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Define the path to the CSV file in the public folder
const csvFilePath = path.join(__dirname, 'public', 'podcast_gita_wirjawan.csv');

// Route to get CSV data
app.get('/podcasts', (req, res) => {
  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading CSV file' });
    }

    // Parse CSV data and send to client
    Papa.parse(data, {
      header: true,
      delimiter: ';',
      complete: (result) => {
        res.json(result.data);
      },
    });
  });
});

// Route to update CSV with new transcripts
app.post('/update-transcripts', (req, res) => {
  const { updatedPodcasts } = req.body;

  // Convert updated data back to CSV
  const csv = Papa.unparse(updatedPodcasts, {
    delimiter: ';',
    header: true,
  });

  // Write updated CSV data to file
  fs.writeFile(csvFilePath, csv, 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error writing to CSV file' });
    }

    res.json({ message: 'CSV updated successfully' });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
