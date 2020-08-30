const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const rateLimit = require("express-rate-limit");
const spotifyTokenService = require('./lib/spotifyTokenService');

// Allow up to 25 requests to /api/ endpoints per IP per 5 minute window
const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 25,
});
const app = express();
const port = process.env.PORT || 3000;
 
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/', apiLimiter);

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