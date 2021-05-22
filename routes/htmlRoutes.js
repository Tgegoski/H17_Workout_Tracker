const path = require('path');
const router = require("express").Router();
const mainRoutes = require('./Routes.js');

app.use(mainRoutes);

module.exports = (app) => {
  // => HTML GET Requests

  app.get('/exercise', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/exercise.html"));
  });

  app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/stats.html"));
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
};
