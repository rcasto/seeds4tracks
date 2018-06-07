var artistTemplate = null;
var artistContainer = null;

var artists = [];

function init() {
    artistTemplate = document.getElementById('artist-template');
    artistContainer = document.getElementById('artist-container');
}

function hasArtist(artistName) {
    return artistName && artists.some(artist => artist === artistName);
}

function removeArtist(artistName) {
    var artistIndex = artists.indexOf(artistName);
    if (artistIndex >= 0) {
        artists.splice(artistIndex, 1);
    }
}

export function getArtists() {
    return artists;
}

/**
 * Adds new artist supplied to artist container using artist template
 * @param {string} artistName 
 * @returns {boolean} True = added new artist, False = artist not added (already had this artist)
 */
export function addArtist(artistName) {
    // Don't add an artist that was already added
    if (hasArtist(artistName)) {
        return false;
    }
    var artist = createArtist(artistName);
    artistContainer.insertBefore(artist, artistContainer.firstChild);
    artists.unshift(artistName);
    return true;
}

function createArtist(artistName) {
    var artistTemplateClone = document.importNode(artistTemplate.content, true);
    var artistNameElem = artistTemplateClone.querySelector('.artist-name');
    var artistRemoveButton = artistTemplateClone.querySelector('.artist-remove');
    artistNameElem.appendChild(document.createTextNode(artistName));
    artistRemoveButton.addEventListener('click', (event) => {
        var artist = event.target.parentNode;
        artist.remove();
        removeArtist(artistName);
    }, false);
    return artistTemplateClone;
}

window.addEventListener('load', init, {
    once: true
});