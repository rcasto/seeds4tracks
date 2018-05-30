import { removeNodeChildren } from './utilityService';

var trackTemplate = null;
var trackContainer = null;

function init() {
    trackTemplate = document.getElementById('track-template');
    trackContainer = document.getElementById('track-container');
}

export function addTrack(track) {
    var trackElem = createTrack(track);
    trackContainer.appendChild(trackElem);
}

export function clearTracks() {
    removeNodeChildren(trackContainer);
}

function createTrack(track) {
    var trackTemplateClone = document.importNode(trackTemplate.content, true);

    var trackTitleElem = trackTemplateClone.querySelector('.track-info-title');
    var trackArtistElem = trackTemplateClone.querySelector('.track-info-artist');
    var trackAlbumImgElem = trackTemplateClone.querySelector('.track-art-img');

    var trackTitle = track.name;
    var trackArtist = (track.artists || []).map(artist => artist.name).join(', ');
    var trackAlbum = track.album.name;
    var trackAlbumArt = (track.album.images || [{
        url: ''
    }])[0].url;

    trackTitleElem.appendChild(document.createTextNode(trackTitle));
    trackArtistElem.appendChild(document.createTextNode(trackArtist));
    trackAlbumImgElem.alt = trackAlbum;
    trackAlbumImgElem.src = trackAlbumArt;

    return trackTemplateClone;
}

window.addEventListener('load', init, false);