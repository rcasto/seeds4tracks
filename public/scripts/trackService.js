import { removeNodeChildren } from './utilityService';

var trackContainer = null;

function init() {
    trackContainer = document.getElementById('track-container');
}

export function dedupeTracks(tracks) {
    var uniqueTracksMap = new Map();
    var dedupedTracks = [];
    (tracks || []).forEach(track => uniqueTracksMap.set(track.id, track));
    uniqueTracksMap.forEach((track, trackId) => dedupedTracks.push(track));
    return dedupedTracks;
}

export function addTracks(tracks) {
    var tracksFragment = document.createDocumentFragment();
    
    (tracks || [])
        .map(track => createTrack(track))
        .forEach(trackElem => tracksFragment.appendChild(trackElem));
    
    trackContainer.appendChild(tracksFragment);
}

export function clearTracks() {
    removeNodeChildren(trackContainer);
}

function createTrack(track) {
    var iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '80';
    iframe.src = `https://open.spotify.com/embed?uri=${track.uri}`;
    iframe.allow = 'encrypted-media';
    iframe.frameBorder = 0;
    return iframe;
}

window.addEventListener('load', init, {
    once: true
});