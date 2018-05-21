// import { fetchToken } from './spotifyTokenService';
import { addArtist } from './artistService';

function onLoad() {
    var artistInput = document.getElementById('artist-input');
    var findNewMusicButton = document.getElementById('find-new-music');
    artistInput.addEventListener('keydown', onKeyFindNewArtist, false);
    findNewMusicButton.addEventListener('click', onFindNewMusic, false);

    // TODO: refactor out into a separate service
    // var spotifyApi = new SpotifyWebApi();
    // fetchToken()
    //     .then(token => {
    //         spotifyApi.setAccessToken(token.access_token);
    //         spotifyApi.searchArtists('Dispatch')
    //             .then(artists => console.log(artists))
    //             .catch(error => console.error(error));
    //     })
    //     .catch(error => console.error(error));
}

function onFindNewMusic(event) {

}

function onKeyFindNewArtist(event) {
    var artistInput = event.target;
    if (event.keyCode !== 13) {
        return;
    }
    if (!artistInput.value) {
        return;
    }
    onAddNewArtist(artistInput.value);
    artistInput.value = '';
}

function onAddNewArtist(artist) {
    console.log(artist);
    addArtist(artist);
}

window.addEventListener('load', onLoad, false);