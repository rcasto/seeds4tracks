import { addArtist, getArtists } from './artistService';

function onLoad() {
    var artistInput = document.getElementById('artist-input');
    var findNewMusicButton = document.getElementById('find-new-music');

    artistInput.addEventListener('keydown', onKeyFindNewArtist, false);
    findNewMusicButton.addEventListener('click', onFindNewMusic, false);
}

function onFindNewMusic(event) {
    console.log(getArtists());
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