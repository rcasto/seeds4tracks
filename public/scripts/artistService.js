var artistTemplate = null;
var artistContainer = null;

function init() {
    artistTemplate = document.getElementById('artist-template');
    artistContainer = document.getElementById('artist-container');
}

function removeArtist(artistName) {
    console.log(artistName);
}

export function addArtist(artistName) {
    var artist = createArtist(artistName);
    artistContainer.appendChild(artist);
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