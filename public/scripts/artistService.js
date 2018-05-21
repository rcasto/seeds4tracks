var artistTemplate = null;
var artistContainer = null;

var artists = [];

function init() {
    artistTemplate = document.getElementById('artist-template');
    artistContainer = document.getElementById('artist-container');
}

function hasArtist(artistName) {
    // TODO: implement this check properly
    return false;
}

function removeArtist(artistName) {
    console.log(artistName);
}

export function getArtists() {
    return artists;
}

export function addArtist(artistName) {
    // Don't add an artist that was already added
    if (hasArtist(artistName)) {
        return;
    }
    var artist = createArtist(artistName);
    artistContainer.appendChild(artist);
    artists.push(artistName);
}

function createArtist(artistName) {
    var artistTemplateClone = document.importNode(artistTemplate.content, true);
    var artistNameElem = artistTemplateClone.querySelector('.artist-name');
    var artistRemoveButton = artistTemplateClone.querySelector('.artist-remove');
    artistNameElem.appendChild(document.createTextNode(artistName));
    artistRemoveButton.addEventListener('click', () => removeArtist(artistName), false);
    return artistTemplateClone;
}

window.addEventListener('load', init, false);