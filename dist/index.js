"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var papaparse_1 = __importDefault(require("papaparse"));
var app = (0, express_1.default)();
app.use(express_1.default.json()); // For parsing application/json
// Serve static files from the public folder
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Define the path to the CSV file in the public folder
var csvFilePath = path_1.default.join(__dirname, 'public', 'podcast_gita_wirjawan.csv');
// Route to get CSV data
app.get('/podcasts', function (req, res) {
    fs_1.default.readFile(csvFilePath, 'utf8', function (err, data) {
        if (err) {
            return res.status(500).json({ message: 'Error reading CSV file' });
        }
        // Parse CSV data and send to client
        papaparse_1.default.parse(data, {
            header: true,
            delimiter: ';',
            complete: function (result) {
                res.json(result.data);
            },
        });
    });
});
// Route to update CSV with new transcripts
app.post('/update-transcripts', function (req, res) {
    var updatedPodcasts = req.body.updatedPodcasts;
    // Convert updated data back to CSV
    var csv = papaparse_1.default.unparse(updatedPodcasts, {
        delimiter: ';',
        header: true,
    });
    // Write updated CSV data to file
    fs_1.default.writeFile(csvFilePath, csv, 'utf8', function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error writing to CSV file' });
        }
        res.json({ message: 'CSV updated successfully' });
    });
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
//# sourceMappingURL=index.js.map