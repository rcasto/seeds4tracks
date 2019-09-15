import { parseJson } from './utilityService';

const seedsSessionKey = 'seeds4track-seeds';
var savedSeeds = loadSavedSeeds();

function supportsSessionStorage() {
    return !!window.sessionStorage;
}

function loadSavedSeeds() {
    savedSeeds = supportsSessionStorage() ?
        parseJson(window.sessionStorage.getItem(seedsSessionKey)) : [];
    savedSeeds = Array.isArray(savedSeeds) ? savedSeeds : [];
    return savedSeeds;
}

function saveSeeds() {
    if (!supportsSessionStorage) {
        return;
    }

    var savedSeedsStringified = JSON.stringify(savedSeeds);
    window.sessionStorage.setItem(seedsSessionKey, savedSeedsStringified);
}

function hasSeed(seed) {
    return seed && savedSeeds.some(savedSeed => seed === savedSeed);
}

export function getSeeds() {
    return savedSeeds;
}

export function addSeed(seed) {
    // Don't add an artist that was already added
    if (hasSeed(seed)) {
        return false;
    }
    savedSeeds.unshift(seed);
    saveSeeds();
    return true;
}

export function removeSeed(seed) {
    var seedIndex = savedSeeds.indexOf(seed);
    if (seedIndex >= 0) {
        savedSeeds.splice(seedIndex, 1);
        saveSeeds();
        return true;
    }
    return false;
}