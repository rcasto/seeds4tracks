const tokenApiUrl = '/api/token';

var token = null;

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
            return token;
        });
}