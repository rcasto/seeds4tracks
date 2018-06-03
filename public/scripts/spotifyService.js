const tokenApiUrl = '/api/token';

var token = null;
var tokenTimestampInMs = null;
var spotifyApi = new SpotifyWebApi();

export const maxSeedArtists = 5;
export const maxNumSeedSetsToPick = 15;
export const maxTrackRecommendations = 20;

export const errors = {
    noSeedArtists: 'No seed artists provided'
};

export function fetchToken() {
    if (isTokenValid()) {
        return Promise.resolve(token);
    }
    return fetch(tokenApiUrl)
        .then(res => res.json())
        .then(_token => {
            token = _token;
            tokenTimestampInMs = Date.now();
            spotifyApi.setAccessToken(token.access_token);
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
        .then(() => spotifyApi.searchArtists(artistName))
        .then(results => {
            var artists = results.artists.items;
            if (artists.length > 0) {
                return artists[0].id;
            }
            return null;
        })
        .catch(error => handleError(error, findIdForArtist.bind(this, artistName)));
}

export function getRecommendationsFromArtists(artists) {
    artists = (artists || []).slice(0, maxSeedArtists);
    if (!artists.length) {
        return Promise.reject({
            reason: errors.noSeedArtists
        });
    }
    return fetchToken()
        .then(() => Promise.all(artists.map(artist => findIdForArtist(artist))))
        .then(artistIds => artistIds.filter(artistId => !!artistId))
        .then(artistIds => spotifyApi.getRecommendations({
            seed_artists: artistIds.join(',')
        }))
        .then(recommendations => recommendations.tracks || [])
        .catch(error => handleError(error, getRecommendationsFromArtists.bind(this, artists)));
}

function isTokenValid() {
    if (typeof token !== 'object' || typeof tokenTimestampInMs !== 'number') {
        return false;
    }
    let currentTimestampInMs = Date.now();
    let elapsedTokenDurationInSeconds = (currentTimestampInMs - tokenTimestampInMs) / 1000;
    return elapsedTokenDurationInSeconds < (token['expires_in'] || Number.MAX_VALUE);
}

function handleError(error, cb) {
    var status = error && error.status;
    if (status === 429) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(cb());
            }, 500);
        });
    }
    return Promise.reject(error);
}