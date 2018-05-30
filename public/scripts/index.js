import { addArtist, getArtists } from './artistService';
import { getCombinationsWithoutRepetitions, shuffle, selectRandomIndices, dedupe } from './utilityService';
import { maxSeedArtists, maxNumSeedSetsToPick, getRecommendationsFromArtists, errors } from './spotifyService';
import { addTrack, clearTracks } from './trackService';

const maxRecommendationTracks = 20;

function onLoad() {
    var artistInput = document.getElementById('artist-input');
    var findNewMusicButton = document.getElementById('find-new-music');

    artistInput.addEventListener('keydown', onKeyFindNewArtist, false);
    findNewMusicButton.addEventListener('click', onFindNewMusic, false);
}

function onFindNewMusic(event) {
    var artists = getArtists();
    var artistCombinations;
    // Not all combinations of artists will be used
    // a random sample of the combinations of artist seeds
    // will be used
    if (artists.length > maxSeedArtists) {
        artistCombinations = shuffle(getCombinationsWithoutRepetitions(artists, maxSeedArtists));
        artistCombinations = selectRandomIndices(artistCombinations, maxNumSeedSetsToPick)
            .map(selectedArtistCombinationIndex => artistCombinations[selectedArtistCombinationIndex]);
    } else {
        artistCombinations = [artists];
    }
    Promise.all(artistCombinations
        .map(artistCombination => getRecommendationsFromArtists(artistCombination)))
        .then(trackArrays => trackArrays.reduce((tracks, currTracks) => tracks.concat(currTracks), []))
        .then(tracks => dedupe(tracks))
        .then(tracks => {
            if (tracks.length > maxRecommendationTracks) {
                tracks = selectRandomIndices(tracks, maxRecommendationTracks)
                    .map(randomTrackIndex => tracks[randomTrackIndex]);
            }
            return tracks;
        })
        .then(tracks => {
            clearTracks();
            return tracks.map(track => {
                addTrack(track);
                return `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
            });
        })
        .then(tracksInfo => console.log(tracksInfo))
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
    onAddNewArtist(artistInput.value);
    artistInput.value = '';
}

function onAddNewArtist(artist) {
    addArtist(artist);
}

window.addEventListener('load', onLoad, false);