import { addArtist, getArtists } from './artistService';
import { getCombinationsWithoutRepetitions, shuffle, selectRandomIndices } from './utilityService';
import { maxSeedArtists, maxNumSeedSetsToPick, getRecommendationsFromArtists } from './spotifyService';

function onLoad() {
    var artistInput = document.getElementById('artist-input');
    var findNewMusicButton = document.getElementById('find-new-music');

    artistInput.addEventListener('keydown', onKeyFindNewArtist, false);
    findNewMusicButton.addEventListener('click', onFindNewMusic, false);

    getRecommendationsFromArtists(['Dispatch', 'Guster'])
        .then(tracks => tracks.map(track => {
            return `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
        }))
        .then(tracksInfo => console.log(tracksInfo))
        .catch(error => console.error(error));
}

function onFindNewMusic(event) {
    var artists = getArtists();
    var artistCombinations = [artists];
    // Not all combinations of artists will be used
    // a random sample of the combinations of artist seeds
    // will be used
    if (artists.length >= maxSeedArtists) {
        artistCombinations = shuffle(getCombinationsWithoutRepetitions(artists, maxSeedArtists));
        artistCombinations = selectRandomIndices(artistCombinations, maxNumSeedSetsToPick)
            .map(selectedArtistCombinationIndex => artistCombinations[selectedArtistCombinationIndex]);
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