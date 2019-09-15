import { addArtist } from './artistService';
import { getSeeds } from './sessionService';
import { getCombinationsWithoutRepetitions, shuffle, selectRandomIndices } from './utilityService';
import { maxSeedArtists, maxNumSeedSetsToPick, maxTrackRecommendations, getRecommendationsFromArtists, errors } from './spotifyService';
import { addTracks, clearTracks, dedupeTracks } from './trackService';

function init() {
    var artistInput = document.getElementById('artist-input');
    var artistContainer = document.getElementById('artist-container');

    // find new music based off of previous saved state, if any
    onFindNewMusic();

    artistInput.addEventListener('keydown', onKeyFindNewArtist, false);
    artistContainer.addEventListener('click', (event) => {
        var targetClassList = event.target.classList;
        if (targetClassList.contains('artist-remove')) {
            onFindNewMusic();
        }
    }, false);
}

function onFindNewMusic() {
    var artists = getSeeds();
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
        .then(tracks => shuffle(tracks))
        .then(tracks => {
            if (tracks.length > maxTrackRecommendations) {
                tracks = selectRandomIndices(tracks, maxTrackRecommendations)
                    .map(randomTrackIndex => tracks[randomTrackIndex]);
            }
            return tracks;
        })
        .then(tracks => {
            clearTracks();
            addTracks(tracks);
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

    let artist = artistInput.value && artistInput.value.trim();
    if (!artist) {
        return;
    }

    let wasArtistAdded = addArtist(artist);
    artistInput.value = '';
    wasArtistAdded && onFindNewMusic();
}

window.addEventListener('load', init, {
    once: true
});