import { addSeed, removeSeed, getSeeds } from './sessionService';

var artistTemplate = null;
var artistContainer = null;

var artistContainerHasArtistsClassName = "artist-container--has-artists";

function init() {
    artistTemplate = document.getElementById('artist-template');
    artistContainer = document.getElementById('artist-container');

    var artistsFragment = document.createDocumentFragment();
    getSeeds()
        .map(artist => createArtist(artist))
        .reverse()
        .forEach(artistElem => artistsFragment.appendChild(artistElem));
    setHasArtistsClass();

    artistContainer.appendChild(artistsFragment);
}

function removeArtist(artistName) {
    removeSeed(artistName);

    const seedCount = getSeeds().length;
    if (seedCount <= 0) {
        artistContainer.classList.remove(artistContainerHasArtistsClassName);
    }
}

/**
 * Adds new artist supplied to artist container using artist template
 * @param {string} artistName 
 * @returns {boolean} True = added new artist, False = artist not added (already had this artist)
 */
export function addArtist(artistName) {
    if (!addSeed(artistName)) {
        return false;
    }
    var artist = createArtist(artistName);
    setHasArtistsClass();
    artistContainer.insertBefore(artist, artistContainer.firstChild);
    return true;
}

function setHasArtistsClass() {
    if (getSeeds().length <= 0) {
        return;
    }
    if (!artistContainer.classList.contains(artistContainerHasArtistsClassName)) {
        artistContainer.classList.add(artistContainerHasArtistsClassName);
    }
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