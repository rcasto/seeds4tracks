const tooManyRequestsStatusCode = 429;

const spotifyTokenEndpoint = '/api/token'; // Server to server call
const spotifyEndpointBase = 'https://api.spotify.com/v1';
const spotifySearchEndpoint = `${spotifyEndpointBase}/search`;
const spotifyRecommendationsEndpoint = `${spotifyEndpointBase}/recommendations`;

export const maxSeedArtists = 5;
export const maxNumSeedSetsToPick = 15;
export const maxTrackRecommendations = 20;

var token = null;
var tokenTimestampInMs = null;

export const errors = {
    noSeedArtists: 'No seed artists provided',
    noRetryFunction: 'No callback function provided to execute for retry'
};

export function fetchToken() {
    if (isTokenValid()) {
        return Promise.resolve(token);
    }
    return fetch(spotifyTokenEndpoint)
        .then(response => response.json())
        .then(_token => {
            token = _token;
            tokenTimestampInMs = Date.now();
            return token;
        })
        // On error fetching new token, make sure
        // to clear existing token to try again with
        // fresh state next time (could try again on timeout)
        .catch(error => {
            token = null;
            tokenTimestampInMs = null;
            return handleError(error, fetchToken);
        });
}

/**
 * Probably want to memoize/cache artistNames to avoid double searching
 * for artists
 * @param {string} artistName
 * @returns {string} Spotify id for provided artist
 */
export function findIdForArtist(artistName) {
    return fetchToken()
        .then(token => {
            console.log('Searching:', artistName);
            var searchUrl = `${spotifySearchEndpoint}?q=${artistName}&type=artist`;
            return fetch(searchUrl, {
                headers: new Headers({
                    'Authorization': `Bearer ${token['access_token']}`
                }),
                method: 'GET'
            });
        })
        .then(response => handleResponse(response, findIdForArtist.bind(this, artistName)))
        .then(results => {
            var artists = (results && results.artists && results.artists.items) || [];
            if (artists.length > 0) {
                return artists[0].id;
            }
            console.log('Returned null for artist');
            return null;
        })
        .catch(handleError);
}

export function getRecommendationsFromArtists(artists) {
    artists = (artists || []).slice(0, maxSeedArtists);
    if (!artists.length) {
        return Promise.reject({
            reason: errors.noSeedArtists
        });
    }
    return Promise.all(artists.map(artist => findIdForArtist(artist)))
        .then(artistIds => artistIds.filter(artistId => !!artistId))
        .then(artistIds => Promise.all([artistIds, fetchToken()]))
        .then((results) => {
            console.log('Results:', results, artists);
            var recommendationsUrl = `${spotifyRecommendationsEndpoint}?seed_artists=${results[0].join(',')}`;
            return fetch(recommendationsUrl, {
                headers: new Headers({
                    'Authorization': `Bearer ${results[1]['access_token']}`
                }),
                method: 'GET'
            });
        })
        .then(response => handleResponse(response, getRecommendationsFromArtists.bind(this, artists)))
        .then(results => (results && results.tracks) || [])
        .catch(handleError);
}

function isTokenValid() {
    if (typeof token !== 'object' || typeof tokenTimestampInMs !== 'number') {
        return false;
    }
    let currentTimestampInMs = Date.now();
    let elapsedTokenDurationInSeconds = (currentTimestampInMs - tokenTimestampInMs) / 1000;
    return elapsedTokenDurationInSeconds < (token['expires_in'] || Number.MAX_VALUE);
}

function handleResponse(response, cb) {
    if (response.ok) {
        return response.json();
    }
    if (response.status === tooManyRequestsStatusCode) {
        if (typeof cb !== 'function') {
            return Promise.reject({
                reason: errors.noRetryFunction
            });
        }
        let retryAfterInSeconds = parseInt(response.headers.get('retry-after') || '1', 10);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                cb()
                    .then(resolve)
                    .catch(reject);
            }, retryAfterInSeconds * 1000);
        });
    }
    return response.json()
        .then(handleError);
}

function handleError(error) {
    console.error(error);
    return Promise.reject(error);
}