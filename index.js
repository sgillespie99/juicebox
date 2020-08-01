require('dotenv').config();




// inside index.js
const { PORT = 3000 } = process.env
const express = require('express');
const server = express();

// new from morgan slide
const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

  const apiRouter = require('./api');
server.use('/api', apiRouter);