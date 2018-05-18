import { fetchToken } from './spotifyTokenService';

function onLoad() {
    var spotifyApi = new SpotifyWebApi();
    fetchToken()
        .then(token => {
            spotifyApi.setAccessToken(token.access_token);
            spotifyApi.searchArtists('Dispatch')
                .then(artists => console.log(artists))
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}

window.addEventListener('load', onLoad, false);