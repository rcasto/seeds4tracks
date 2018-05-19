var artistTemplate = null;

function init() {
    artistTemplate = document.getElementById('artist-template');
}

function removeArtist(artist) {
    console.log(artist);
}

export function createArtist(artistName) {
    var artistTemplateClone = document.importNode(artistTemplate.content, true);
    var artistNameElem = artistTemplateClone.querySelector('.artist-name');
    var artistRemoveButton = artistTemplateClone.querySelector('.artist-remove');
    artistNameElem.appendChild(document.createTextNode(artistName));
    artistRemoveButton.addEventListener('click', () => removeArtist(artistName), false);
    return artistTemplateClone;
}

window.addEventListener('load', init, false);