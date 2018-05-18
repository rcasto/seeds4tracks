import { fetchToken } from './spotifyTokenService';

function onLoad() {
    console.log('Ready to party!');
    fetchToken()
        .then(token => console.log(token))
        .catch(error => console.error(error));
}

window.addEventListener('load', onLoad, false);