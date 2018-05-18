const request = require('request');
const config = require('../config.json');

const spotifyTokenEndpoint = 'https://accounts.spotify.com/api/token';
const authorizationHeader = `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`;

const options = {
    url: spotifyTokenEndpoint,
    headers: {
        Authorization: authorizationHeader
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

function getToken() {
    return new Promise((resolve, reject) => {
        request.post(options, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                return reject(error);
            }
            resolve(body);
        });
    });
}

module.exports = {
    getToken
};