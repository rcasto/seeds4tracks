/**
 * Taken from:
 * https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/sets/combinations/combineWithoutRepetitions.js
 */
export function getCombinationsWithoutRepetitions(combinationOptions, combinationLength) {
    // If combination length is just 1 then return combinationOptions.
    if (combinationLength === 1) {
        return combinationOptions.map(option => [option]);
    }

    // Init combinations array.
    const combinations = [];

    for (let i = 0; i <= (combinationOptions.length - combinationLength); i += 1) {
        const smallerCombinations = getCombinationsWithoutRepetitions(
        combinationOptions.slice(i + 1),
        combinationLength - 1,
        );

        for (let j = 0; j < smallerCombinations.length; j += 1) {
        const combination = [combinationOptions[i]].concat(smallerCombinations[j]);
        combinations.push(combination);
        }
    }

    // Return all calculated combinations.
    return combinations;
}

export function selectRandomIndices(array, numIndices) {
    var indexSet = new Set();
    var indices = [];
    var randomIndex;
    array = array || [];
    numIndices = numIndices || 1;
    if (numIndices > array.length) {
        numIndices = array.length;
    }
    while (indexSet.size < numIndices) {
        randomIndex = selectRandomIndex(array);
        if (!indexSet.has(randomIndex)) {
            indexSet.add(randomIndex);
        }
    }
    indexSet.forEach(index => indices.push(index));
    return indices;
}

function selectRandomIndex(array) {
    return Math.floor(Math.random() * (array || []).length);
}

/**
 * Right now this would change the array inline to be shuffled
 * Would not return a copy that is shuffled
 * @param { The array to be shuffled } array 
 */
export function shuffle(array) {
    var randomIndex, arrayLength, i;
    array = array || [];
    arrayLength = array.length;
    for (i = 0; i < arrayLength; i++) {
        randomIndex = selectRandomIndex(array);
        swap(array, i, randomIndex);
    }
    return array;
}

// This would not work if the indices hold an object would it?
function swap(array, index1, index2) {
    var arrayLength = (array || []).length;
    if (
        !arrayLength || 
        (index1 < 0 || index1 >= arrayLength) ||
        (index2 < 0 || index2 >= arrayLength)
    ) {
        return;
    }
    var tmp = array[index1];
    array[index1] = array[index2];
    array[index2] = tmp;
}

export function dedupe(array) {
    var uniqueItems = new Set();
    var dedupedArray = [];
    (array || []).forEach(item => uniqueItems.add(item));
    uniqueItems.forEach(uniqueItem => dedupedArray.push(uniqueItem));
    return dedupedArray;
}