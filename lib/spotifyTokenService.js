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
            if (error) {
                console.error(error);
                return reject(error);
            }
            console.log(response.statusCode, body);
            resolve(body);
        });
    });
}

getToken()
    .then(token => console.log(token))
    .catch(error => console.error(error));

module.exports = {
    getToken
};