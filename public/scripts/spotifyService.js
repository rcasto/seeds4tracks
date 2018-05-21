const tokenApiUrl = '/api/token';

var token = null;
var spotifyApi = new SpotifyWebApi();

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
            spotifyApi.setAccessToken(token);
            return token;
        });
}

// export function findNewMusic(artists) {
//     return (artists || [])
//         .map(artist => )
// }