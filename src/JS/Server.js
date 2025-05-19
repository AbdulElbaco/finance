import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static('src'));

// Server status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'running' });
});

// Server start endpoint
app.post('/start', (req, res) => {
  // Since the server is already running if this endpoint is reachable,
  // we just return success
  res.json({ status: 'started' });
});

const usersFile = './src/data/users.json';
const applicationsFile = './src/data/applications.json';

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Get all users
app.get('/api/users', (req, res) => {
  res.json(readJson(usersFile));
});

// Add a user
app.post('/api/users', (req, res) => {
  const users = readJson(usersFile);
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  writeJson(usersFile, users);
  res.status(201).json(newUser);
});

// Get all applications
app.get('/api/applications', (req, res) => {
  res.json(readJson(applicationsFile));
});

// Add a new application
app.post('/api/applications', (req, res) => {
  const applications = readJson(applicationsFile);
  const newApp = { id: Date.now(), status: 'pending', ...req.body };
  applications.push(newApp);
  writeJson(applicationsFile, applications);
  res.status(201).json(newApp);
});

// Update application status
app.patch('/api/applications/:id', (req, res) => {
  const applications = readJson(applicationsFile);
  const appIndex = applications.findIndex(a => a.id == req.params.id);
  if (appIndex === -1) return res.status(404).json({ error: 'Not found' });

  applications[appIndex].status = req.body.status;
  writeJson(applicationsFile, applications);
  res.json(applications[appIndex]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});