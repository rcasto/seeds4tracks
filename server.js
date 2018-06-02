const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const spotifyTokenService = require('./lib/spotifyTokenService');

var app = express();
var port = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/api/token', (req, res) => {
    spotifyTokenService.getToken()
        .then(token => res.json(token))
        .catch(error => res.status(500).json(error));
});

app.listen(port, 
    () => console.log(`Server started on port ${port}`));