import { addArtist, getArtists } from './artistService';
import { getCombinationsWithoutRepetitions, shuffle, selectRandomIndices } from './utilityService';
import { maxSeedArtists, maxNumSeedSetsToPick, maxTrackRecommendations, getRecommendationsFromArtists, errors } from './spotifyService';
import { addTrack, clearTracks, dedupeTracks } from './trackService';

function init() {
    var artistInput = document.getElementById('artist-input');
    var artistContainer = document.getElementById('artist-container');

    artistInput.addEventListener('keydown', onKeyFindNewArtist, false);
    artistContainer.addEventListener('click', (event) => {
        var targetClassList = event.target.classList;
        if (targetClassList.contains('artist-remove')) {
            onFindNewMusic();
        }
    }, false);
}

function onFindNewMusic() {
    var artists = getArtists();
    var numArtists = artists.length || 0;
    var artistCombinations;
    if (numArtists === 0) {
        clearTracks();
        return;
    }
    // Not all combinations of artists will be used
    // a random sample of the combinations of artist seeds
    // will be used
    if (numArtists > maxSeedArtists) {
        artistCombinations = shuffle(getCombinationsWithoutRepetitions(artists, maxSeedArtists));
        artistCombinations = selectRandomIndices(artistCombinations, maxNumSeedSetsToPick)
            .map(selectedArtistCombinationIndex => artistCombinations[selectedArtistCombinationIndex]);
    } else {
        artistCombinations = [artists];
    }
    Promise.all(artistCombinations
        .map(artistCombination => getRecommendationsFromArtists(artistCombination)))
        .then(trackArrays => trackArrays.reduce((tracks, currTracks) => tracks.concat(currTracks), []))
        .then(tracks => dedupeTracks(tracks))
        .then(track => shuffle(tracks))
        .then(tracks => {
            if (tracks.length > maxTrackRecommendations) {
                tracks = selectRandomIndices(tracks, maxTrackRecommendations)
                    .map(randomTrackIndex => tracks[randomTrackIndex]);
            }
            return tracks;
        })
        .then(tracks => {
            clearTracks();
            tracks.forEach(track => addTrack(track));
        })
        .catch(error => {
            if (error && error.reason && error.reason === errors.noSeedArtists) {
                return;
            }
            console.error(error);
        });
}

function onKeyFindNewArtist(event) {
    var artistInput = event.target;

    if (event.keyCode !== 13) {
        return;
    }
    if (!artistInput.value) {
        return;
    }

    let artist = artistInput.value;
    artistInput.value = '';

    let wasArtistAdded = addArtist(artist);
    wasArtistAdded && onFindNewMusic();
}

window.addEventListener('load', init, {
    once: true
});