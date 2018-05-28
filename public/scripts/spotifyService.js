const tokenApiUrl = '/api/token';

var token = null;
var spotifyApi = new SpotifyWebApi();

export const maxSeedArtists = 5;
export const maxNumSeedSetsToPick = 6;

export const errors = {
    noSeedArtists: 'No seed artists provided'
};

// TODO: implement auto refreshing token
// Expires in an hour right now (keeping cached in memory)
export function fetchToken(shouldRefreshToken = true) {
    if (token) {
        return Promise.resolve(token);
    }
    return fetch(tokenApiUrl)
        .then(res => res.json())
        .then(_token => {
            token = _token;
            spotifyApi.setAccessToken(token.access_token);
            return token;
        });
}

/**
 * Probably want to memoize/cache artistNames to avoid double searching
 * for artists
 * @param {Artist name as string to find Spotify Id for} artistName 
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
        });
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
        .then(recommendations => recommendations.tracks || []);
}