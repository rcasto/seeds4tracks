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