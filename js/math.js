function findSmallestDivisor(num) {
    for (let i = 2; i <= num; i++) {
        if (num % i === 0) return i
    }
    return num // If number is prime
}
function findLargestDivisor(num){
    const smallestDivisor = findSmallestDivisor(num)
    return num / smallestDivisor
}
function computeWordStatistics(wordsArray){
    let cleanedWordsArray = wordsArray.map(word => {
        return word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    });
    const avgLength = computeAverageLength(cleanedWordsArray)
    const longestWord = findLongestElement(cleanedWordsArray)
    const shortestWord = findShortestElement(cleanedWordsArray)
    const wordCount = wordsArray.length
    return {avgLength: avgLength, longestWord: longestWord, wordCount: wordCount, shortestWord: shortestWord}
}
function computeAverageLength(array) {
    if (array.length === 0) {
        return 0; // Avoid division by zero
    }

    let totalLength = array.reduce((sum, element) => {
        return sum + element.length;
    }, 0);

    let averageLength = totalLength / array.length;
    return Math.round(averageLength)
}
function findLongestElement(array) {
    if (array.length === 0) return null; // Return null for an empty array
    let longestElement = array[0];
    array.forEach(element => {
        if (element.length > longestElement.length) longestElement = element;
    });
    return {element: longestElement, length: longestElement.length}
}
function findShortestElement(array) {
    if (array.length === 0) return null; // Return null for an empty array
    let longestElement = array[0];
    array.forEach(element => {
        if (element.length < longestElement.length) longestElement = element;
    });
    return {element: longestElement, length: longestElement.length}
}