import { addArtist, getArtists } from './artistService';
import { getCombinationsWithoutRepetitions } from './utilityService';
import { maxSeedArtists } from './spotifyService';

function onLoad() {
    var artistInput = document.getElementById('artist-input');
    var findNewMusicButton = document.getElementById('find-new-music');

    artistInput.addEventListener('keydown', onKeyFindNewArtist, false);
    findNewMusicButton.addEventListener('click', onFindNewMusic, false);
}

function onFindNewMusic(event) {
    var artists = getArtists();
    var artistCombinations = [artists];
    if (artists.length >= maxSeedArtists) {
        artistCombinations = getCombinationsWithoutRepetitions(artists, maxSeedArtists);
    }
    console.log(artistCombinations);
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