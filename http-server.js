const _ = require('lodash');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const config = require('./config');

// Yes, it is a global variable (and they are generally considered bad practice) but
// in this case it is way more laconic than require config in every single file.
global.config = config;

// Global state.
// In real world application this data would be stored in database.
global.gs = {
  users: []
};

global.app = express();
global.app.use(bodyParser.json());

// Introduce artificial delay so that it is possible to spot the loader on the client.
global.app.use((req, res, next) => setTimeout(next, config.serverDelay));

// Require all files (not directories) in the '/api' directory, this way when
// a new api is created there would be no need to add a new require statement.
_.each(fs.readdirSync('./api'), path => path.indexOf('.') > -1 ? require(`./api/${path}`) : void(0));

// Serve API and static data from node, in a real world app there most likely would be
// something like nginx in front of node.
global.app.use(express.static(path.join(__dirname, 'dist')));

// If none of the above middlewares handled the request.
global.app.use((req, res) => {
  if (req.url.startsWith('/api')) res.status(500).send(`'${req.url}' does not exist.`);
  else fs.createReadStream('./dist/index.html').pipe(res);
});

global.app.listen(config.port, () => console.log(`Listening at http://localhost:${config.port}`));

