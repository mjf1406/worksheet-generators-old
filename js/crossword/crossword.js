// -------- NOTES -------- //
/*
    -- On the grid and arrays --
    grid[y][x] 
    It must be this way, else you'll get a row going across multiple array. Currently
    a column goes across multiple arrays, I.E. the 'x = 4' column. You may have noticed
    that the letter properly match the axis when the arrays are displayed like this, x
    being the horizontal axis and y being the vertical axis, but when indexed, the order
    is opposite: grid[y][x]
    [
        [x = 1, x = 2, x = 3, x = 4], y = 0
        [x = 1, x = 2, x = 3, x = 4], y = 1
        [x = 1, x = 2, x = 3, x = 4], y = 2
    ]
*/
const DIRECTIONS = [ 'left-to-right','top-to-bottom' ]

let downloadCrossword = document.getElementById('download-crossword')
let printCrossword = document.getElementById('print-crossword')
let previewButtonCrossword = document.getElementById('preview-crossword-button')
let presetDropdown = document.getElementById('presets-dropdown-crossword')
let savePresetCrossword = document.getElementById('open-preset-crossword')
let deletePresetCrossword = document.getElementById('delete-preset-crossword')
let updatePresetCrossword = document.getElementById('update-preset-crossword')

if (JSON.parse(localStorage.getItem('crossword-presets'))) {
    refreshPresetDropdownCrossword()
} else {
    let presetsDropdown = document.getElementById('presets-dropdown-crossword')
    let option = document.createElement('option')
    option.innerText = 'Select preset...'
    option.value = 'load'
    presetsDropdown.appendChild(option)
}

previewButtonCrossword.addEventListener('click', function(){
    let start = new Date().getTime(); 
    let params = getCrosswordParams()
    if (params.words.length === 0) return makeToast("Please add some words!", 'warning')
    let crosswordData = generateCrossword(params)
    if (typeof crosswordData === 'object' || crosswordData instanceof Object) { 
        updatePreview(crosswordData, 'crossword-preview')
        // TODO: updateCrosswordWordClueBank(crosswordData)
        let end = new Date().getTime(); 
        makeToast(`Crossword Puzzle generated in ${formatMillisecondsToReadable(end - start)}`, 'success')
    }
})
downloadCrossword.addEventListener('click', function(){
    let wordSearchData = JSON.parse(localStorage.getItem('crossword-data'))
    let page = wordSearchData.page
    let unit = (page === 'a4') ? 'mm' : 'in' 
    let worksheet = document.getElementById('crossword-worksheet')
    let title = document.getElementById('title').value ? document.getElementById('title').value : "No Title"
    var opt = {
        margin:       10,
        filename:     'myfile.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: unit, format: page, orientation: 'portrait' }
    };
    html2pdf().from(worksheet).set(opt).save(`${title}.pdf`)
})
savePresetCrossword.addEventListener('click', function(){
    localStorage.setItem('clicked-preset','crossword-presets')
})
deletePresetCrossword.addEventListener('click', function(){
    localStorage.setItem('clicked-preset','crossword-presets')
})
presetDropdown.addEventListener('change', function(){
    let selectedPreset = this.value
    if (selectedPreset === 'load') return
    let preset = getCrosswordPresetData(selectedPreset).params
    populateOptionsFromCrosswordPreset(preset)
    makeToast(`<b>${selectedPreset}</b> loaded successfully!`, 'success')
})

let titleCrossword = document.getElementById('title-crossword')
let pageCrossword = document.getElementById('page-size-crossword')
let firstLetters = document.getElementById('reveal-first-letters')
let lastLetters = document.getElementById('reveal-last-letters')
let wordsClues = document.getElementById('words-and-clues')
let crossword = document.getElementById('preview-crossword')
let displayClues = document.getElementById('crossword-clues')
let printKey = document.getElementById('key-crossword')

// -------- CROSSWORD -------- //

function getCrosswordParams(){
    let titleCrossword = document.getElementById('title-crossword').value
    let pageCrossword = getSelectedValueFromRadioGroup('page-size-crossword').replace('-crossword','')
    let firstLetters = document.getElementById('reveal-first-letters').checked
    let lastLetters = document.getElementById('reveal-last-letters').checked
    let wordsClues = document.getElementById('words-and-clues').value
    let printKey = document.getElementById('key-crossword').checked
    wordsClues = wordsClues.split('\n').map(x => x.trim())
    let wordsCluesObjArray = []
    for (let index = 0; index < wordsClues.length; index++) {
        let element = wordsClues[index]
        let elem = splitAtFirst(element, " ")
        wordsCluesObjArray.push({word: elem[0], clue: elem[1]})
    }
    const params = {
        title: titleCrossword, // Any alphanumeric string
        page: pageCrossword, // a4, letter,
        key: printKey, // Boolean
        revealFirsts: firstLetters, // Boolean
        revealLasts: lastLetters, // Boolean
        words: wordsCluesObjArray
    }
    return params
}
function hasMutualLetter(word, wordToSearch){
    let mutLetters = []
    for (let index = 0; index < word.length; index++) {
        const wordLetter = word[index];
        for (let index = 0; index < wordToSearch.length; index++) {
            const searchLetter = wordToSearch[index];
            if (wordLetter === searchLetter && !mutLetters.includes(searchLetter)) {
                mutLetters.push(wordLetter)
            }
        }
    }
    return mutLetters.length > 0 ? mutLetters : false 
}
function placeCrosswordLetter(direction, x1, y1, letterIndex, grid, letterCoords, letter) {
    const [dx, dy] = DELTAS[direction];
    const x = x1 + dx * letterIndex;
    const y = y1 + dy * letterIndex;
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
        return false
    }
    const charAtCoordInGrid = grid[x][y]
    // Empty grid tile
    if (charAtCoordInGrid === undefined) {
        grid[x][y] = letter
        letterCoords.push( { x, y, letter } )
        return true
    }
    // Overlapping letters
    else if (charAtCoordInGrid === letter) {
        letterCoords.push({ x, y, letter })
        return true
    }
    return false
}
function getWordsOnGrid(wordData){
    try {
        return wordData.filter(x => x.placed === true)
    } catch(e){
        console.error(e)
        return undefined
    }
}
function isLetterInWord(letter, word){
    for (let index = 0; index < word.length; index++) {
        const wordLetter = word[index];
        if (wordLetter === letter) return true
    }
    return false
}
function determineWordsWithMutualLetters(words){
    let wordData = []
    for (let index = 0; index < words.length; index++) {
        let wordsWithMutualLetters = []
        const element = words[index];
        let baseWord = element.word
        for (let index = 0; index < words.length; index++) {
            const hasMutualLetterData = words[index];
            const hasMutualLetterWord = hasMutualLetterData.word
            if (hasMutualLetterWord === baseWord) continue
            let mutualLetters = hasMutualLetter(baseWord, hasMutualLetterWord)
            if (mutualLetters != false) wordsWithMutualLetters.push({word: hasMutualLetterWord, letters: mutualLetters})
        }
        wordData.push({word: baseWord, clue: element.clue, wordsWithMutualLetters: wordsWithMutualLetters, isPlaced: false})
    }
    return wordData
}
function setupGrid(width, height){
    let grid = new Array(height)
    for (let index = 0; index < grid.length; index++) {
        grid[index] = new Array(width)        
    }
    return grid
}
function switchDirection(direction){
    if (direction == 'left-to-right') return 'top-to-bottom'
    else if (direction == 'top-to-bottom') return 'left-to-right'
}
function computeStartingCoords(word, direction, mutualLetter, mutualLetterX, mutualLetterY){
    const indexOfLetter = word.indexOf(mutualLetter)
    if (direction == 'left-to-right') {
        return {x: mutualLetterX - indexOfLetter, y: mutualLetterY - 1}
    }
    else if (direction == 'top-to-bottom') {
        return {x: mutualLetterX - 1, y: mutualLetterY - indexOfLetter}
    }
}
function placeFirstWord(firstWordData, params){
    const width = params.width
    const height = params.height
    const word = firstWordData.word
    const grid = params.grid
    const coords = []

    const direction = DIRECTIONS.random()
    const deltas = DELTAS[direction]
    let x = Math.round(getRndInteger(0, width / 2))
    let y = Math.round(getRndInteger(0, height / 2))


    for (let index = 0; index < word.length; index++) {
        const letter = word[index];
        y = y + deltas[1]
        x = x + deltas[0]
        coords.push({
            letter: letter,
            x: x,
            y: y
        })
        grid[y][x] = letter
    }

    params.words[0].isPlaced = true
    params.words[0].coords = coords
    params.words[0].direction = direction
    params.grid = grid
    return params
}
function generateCrossword(params){
    let words = params.words
    let wordsLengthDescending = words.sort((a, b) => b.word.length - a.word.length)
    let longestWordClue = wordsLengthDescending.shift()
    let longestWord = longestWordClue.word
    let wordsShuffled = shuffleArray([...wordsLengthDescending]) // Shuffle the array
    let wordsFiltered = wordsShuffled.filter(x => x.word != "" || x.word != " ")
    wordsFiltered.unshift(longestWordClue)

    let title = params.title
    let page = params.page
    let printKey = params.key
    let revealFirst = params.revealFirst
    let revealLast = params.revealLast
    let width = Math.ceil(longestWord.length * ((getRndInteger(1,5) / 10) + 2)) // Random number between 1.1 and 1.5
    let height = Math.ceil(longestWord.length * ((getRndInteger(1,5) / 10) + 2)) // Random number between 1.1 and 1.5

    let grid = setupGrid(width, height)
    params.height = height
    params.width = width
    params.grid = grid

    let wordData = determineWordsWithMutualLetters(wordsFiltered)

    // Place the first word
    const firstWord = wordData[0]
    params.words = wordData
    params = placeFirstWord(firstWord, params)
    grid = params.grid
    wordData = params.words

    // Place the rest of the words
    for (let index = 0; index < wordData.length; index++) {
        const element = wordData[index]
        const word = element.word // This is the word that we're trying to place on the grid
        const wordsWithMutualLetters = element.wordsWithMutualLetters
        let wordDirection
        let coords = []
        let isPlaced = element.isPlaced 
        if (isPlaced == true) continue // Skip 'word' because it is already on the grid
        mutualWordsLoop: for (let idx = 0; idx < wordsWithMutualLetters.length; idx++) {
            if (isPlaced == true) break mutualWordsLoop
            const element = wordsWithMutualLetters[idx]
            const mutualWord = element.word // This is the word that we're looking for on the grid
            const wordWithMutualLettersData = wordData.find(x => x.word == mutualWord)
            const mutualWordDirection = wordWithMutualLettersData.direction
            if (!mutualWordDirection) continue
            const mutualWordLetters = element.letters
            const mutualWordIsPlaced = wordWithMutualLettersData.isPlaced
            wordDirection = switchDirection(mutualWordDirection)
            if (mutualWordIsPlaced == false) continue // Skip 'mutualWordWithLetters' because it's not on the grid, therefore cannot place 'word'
            console.log(`~~~ Placing word : ${word} on ${mutualWord}`)
            mutualLettersLoop: for (let index = 0; index < mutualWordLetters.length; index++) {
                if (isPlaced == true) break mutualLettersLoop
                const mutualLetter = mutualWordLetters[index];
                const mutualLetterData = wordWithMutualLettersData.coords.find(i => i.letter == mutualLetter)
                const mutualLetterX = mutualLetterData.x
                const mutualLetterY = mutualLetterData.y
                const startingCoords = computeStartingCoords(word, wordDirection, mutualLetter, mutualLetterX, mutualLetterY)
                let x = startingCoords.x
                let y = startingCoords.y
                const deltas = DELTAS[wordDirection]
                wordLetterLoop: for (let index = 0; index < word.length; index++) {
                    const letter = word[index];
                    y = y + deltas[1]
                    x = x + deltas[0]
                    if (x < 0 || y < 0) break wordLetterLoop
                    if (x >= width || y >= height) break wordLetterLoop
                    const cell = grid[y][x]
                    if (cell != undefined && cell != mutualLetter) break wordLetterLoop
                    coords.push({
                        letter: letter,
                        x: x,
                        y: y
                    })
                    grid[y][x] = letter
                    if (index == word.length - 1) {
                        isPlaced = true
                        console.log(`~!~ Successfully placed ${word} on ${mutualWord}`)
                    }
                }
            }
            /*
                FIGURE OUT WHAT TO DO HERE
                    Need to make this recursive because if no mutualWord is on the grid, then the word will not get placed. The loop
                    will continue through all words and place those that it can, but there will be words that were not placed.
            */
        }
        element.coords = coords
        element.isPlaced = isPlaced
        element.direction = wordDirection
    }

    // Blank out the remaining cells
    for (let y = 0; y < grid.length; y++) {
        const column = grid[y];
        for (let x = 0; x < column.length; x++) {
            if (grid[y][x] == undefined) grid[y][x] = " "            
        }
    }
    
    params.words = wordData
    params.grid = grid
    console.log("🚀 ~ file: crossword.js:279 ~ generateCrossword ~ params:", params)
    return params
}


// -------- PRESETS -------- //

function getCrosswordPresetData(presetName){
    let presets = JSON.parse(localStorage.getItem('crossword-presets'))
    return presets.find(item => item.name === presetName)
}
function populateOptionsFromCrosswordPreset(presetOptions){
    titleCrossword.value = presetOptions.title
    checkSelectedRadioButtonsInGroup('page-size-crossword', [presetOptions.page])
    if (presetOptions.key == true) printKey.checked = true
    else printKey.checked = false
    if (presetOptions.revealFirsts == true) firstLetters.checked = true
    else revealFirsts.checked = false
    if (presetOptions.revealLasts == true) lastLetters.checked = true
    else revealLasts.checked = false
}
function refreshPresetDropdownCrossword(){
    let presets = JSON.parse(localStorage.getItem('crossword-presets'))
    let presetsDropdown = document.getElementById('presets-dropdown-crossword')
    presetsDropdown.innerHTML = ''
    let option = document.createElement('option')
    option.innerText = 'Select preset...'
    option.value = 'load'
    presetsDropdown.appendChild(option)
    for (let index = 0; index < presets.length; index++) {
        let presetName = presets[index].name
        // let li = document.createElement('li')
        // let a = document.createElement('a')
        let a = document.createElement('option')
        a.classList.add('block')
        a.classList.add('px-4')
        a.classList.add('py-2')
        a.classList.add('hover-bg-gray-100')
        a.classList.add('dark:hover:bg-gray-600')
        a.classList.add('dark:hover:text-white')
        a.innerText = presetName
        // li.appendChild(a)
        // presetsDropdown.appendChild(li)
        presetsDropdown.appendChild(a)
    }
}