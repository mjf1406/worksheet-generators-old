let downloadCrossword = document.getElementById('download-crossword')
let printCrossword = document.getElementById('print-crossword')
let previewButtonCrossword = document.getElementById('preview-crossword')
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
    if (params.wordsHints.length === 0) return makeToast("Please add some words!", 'warning')
    let crosswordData = generateCrossword(params)
    console.log("🚀 ~ file: crossword.js:25 ~ previewButtonCrossword.addEventListener ~ crosswordData:", crosswordData)
    if (typeof crosswordData === 'object' || crosswordData instanceof Object) { 
        // TODO: updateWordSearchPreview(crosswordData)
        // TODO: updateWordBank(crosswordData)
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
let wordsHints = document.getElementById('words-and-hints')
let crossword = document.getElementById('preview-crossword')
let displayHints = document.getElementById('crossword-hints')
let printKey = document.getElementById('key-crossword')

function getCrosswordParams(){
    let titleCrossword = document.getElementById('title-crossword').value
    let pageCrossword = getSelectedValueFromRadioGroup('page-size-crossword').replace('-crossword','')
    let firstLetters = document.getElementById('reveal-first-letters').checked
    let lastLetters = document.getElementById('reveal-last-letters').checked
    let wordsHints = document.getElementById('words-and-hints').value
    let printKey = document.getElementById('key-crossword').checked
    wordsHints = wordsHints.split('\n').map(x => x.trim())
    let wordsHintsObjArray = []
    for (let index = 0; index < wordsHints.length; index++) {
        let element = wordsHints[index]
        let elem = splitAtFirst(element, " ")
        wordsHintsObjArray.push({word: elem[0], hint: elem[1]})
    }
    const params = {
        title: titleCrossword, // Any alphanumeric string
        page: pageCrossword, // a4, letter,
        key: printKey, // Boolean
        revealFirsts: firstLetters, // Boolean
        revealLasts: lastLetters, // Boolean
        wordsHints: wordsHintsObjArray
    }
    return params
}
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
function generateCrossword(params){
    const DIRECTIONS = [ 'left-to-right','top-to-bottom' ]
    let wordsHints = params.wordsHints
    // wordsHints = wordsHints.sort((a, b) => b.length - a.length) // Sort in descending order
    let wordsHintsLengthDescending = wordsHints.sort((a, b) => b.word.length - a.word.length)
    let longestWordHint = wordsHintsLengthDescending.shift()
    let longestWord = longestWordHint.word
    let wordsHintsShuffled = shuffleArray([...wordsHintsLengthDescending]) // Shuffle the array
    let wordsHintsFiltered = wordsHintsShuffled.filter(x => x.word != "" || x.word != " ")
    wordsHintsFiltered.unshift(longestWordHint)

    let title = params.title
    let page = params.page
    let printKey = params.key
    let revealFirst = params.revealFirst
    let revealLast = params.revealLast
    let width = Math.ceil(longestWord.length * ((getRndInteger(1,5) / 10) + 2)) // Random number between 1.1 and 1.5
    let height = Math.ceil(longestWord.length * ((getRndInteger(1,5) / 10) + 2)) // Random number between 1.1 and 1.5

    let grid = new Array(width)
    for (let index = 0; index < grid.length; index++) {
        grid[index] = new Array(height)        
    }
    let wordData = []
    // Find words with mutual letters
    for (let index = 0; index < wordsHintsFiltered.length; index++) {
        let wordsWithMutualLetters = []
        const element = wordsHintsFiltered[index];
        let baseWord = element.word
        for (let index = 0; index < wordsHintsFiltered.length; index++) {
            const hasMutualLetterData = wordsHintsFiltered[index];
            const hasMutualLetterWord = hasMutualLetterData.word
            if (hasMutualLetterWord === baseWord) continue
            let mutualLetters = hasMutualLetter(baseWord, hasMutualLetterWord)
            if (mutualLetters != false) wordsWithMutualLetters.push({word: hasMutualLetterWord, letters: mutualLetters})
        }
        wordData.push({word: baseWord, hint: element.hint, wordsWithMutualLetters: wordsWithMutualLetters, placed: false})
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
    function letterInWord(letter, word){
        for (let index = 0; index < word.length; index++) {
            const wordLetter = word[index];
            if (wordLetter === letter) return true
        }
        return false
    }
    for (let wordIndex = 0; wordIndex < wordData.length; wordIndex++) {
        const MAX_ATTEMPTS = wordData.length
        let word = wordData[wordIndex].word
        console.log("-----------------------------------------------------")
        console.log("🚀 ~ file: crossword.js:204 ~ generateCrossword ~ word:", word)
        console.log("🚀 ~ file: crossword.js:212 ~ generateCrossword ~ wordData[wordIndex]:", wordData[wordIndex])
        let attempt = 1
        let wordPlaced = false
        let direction
        let letterCoords = []
        let wordsWithMutualLetters = wordData[wordIndex].wordsWithMutualLetters
        // while (attempt <= MAX_ATTEMPTS && wordPlaced === false) {
            direction = getRandomArrayElement(DIRECTIONS)
            let x1 = 0
            let y1 = 0
            let wordsOnGrid = getWordsOnGrid(wordData)
            for (let mutualWordIndex = 0; mutualWordIndex < wordsWithMutualLetters.length; mutualWordIndex++) {
                const element = wordsWithMutualLetters[mutualWordIndex]
                const mutualWord = element.word
                const mutualLetters = element.letters
                const mutualWordOnGrid = wordsOnGrid.find(x => x.word === mutualWord) ? true : false
                if (mutualWordOnGrid){
                    const mutualWordOnGridData = wordData.find(x => x.word === mutualWord)
                    const mutualWordOnGridCoords = mutualWordOnGridData.wordCoords
                    const mutualWordOnGridDirection = mutualWordOnGridData.direction
                    console.log("🚀 ~ file: crossword.js:232 ~ generateCrossword ~ mutualWordOnGridCoords:", mutualWordOnGridCoords)
                    console.log("🚀 ~ file: crossword.js:228 ~ generateCrossword ~ mutualLetters:", mutualLetters)
                    for (let index = 0; index < mutualLetters.length; index++) {
                        const letter = mutualLetters[index];
                        const letterCoords = mutualWordOnGridCoords.find(x => x.letter === letter)
                        const letterX = letterCoords.x
                        const letterY = letterCoords.y
                        const indexOfMutualLetterInBaseWord = word.indexOf(letter)
                        if (mutualWordOnGridDirection === 'left-to-right'){
                            direction = 'top-to-bottom'
                            y1 = letterY - indexOfMutualLetterInBaseWord
                            x1 = letterX
                        } else if (mutualWordOnGridDirection === 'top-to-bottom'){
                            direction = 'left-to-right'
                            y1 = letterY
                            x1 = letterX - indexOfMutualLetterInBaseWord
                        } else if (wordIndex === 0) {
                            x1 = 0
                            y1 = 0
                        }
                        letterCoords = []
                        let wordLength = word.length
                        let lettersPlaced = 0
                        for (let letterIndex = 0; letterIndex < wordLength; letterIndex++) {
                            const letter = word[letterIndex]
                            if (!placeCrosswordLetter(direction, x1, y1, letterIndex, grid, letterCoords, letter)) {
                                break
                            }
                            lettersPlaced += 1
                        }
                        if (wordLength === lettersPlaced) wordPlaced = true
                        if (wordPlaced === true) {   
                            wordData[wordIndex].coords = letterCoords   
                            wordData[wordIndex].placed = true
                            break
                        }
                        if (wordPlaced === false) {
                            for (let index = 0; index < letterCoords.length; index++) {
                                const element = letterCoords[index];    
                                grid[element.x][element.y] = undefined
                            }
                        }
                        attempt += 1
                    }
                }
            }
        // }
        wordData[wordIndex].direction = direction
        wordData[wordIndex].wordCoords = letterCoords
    }
    params.wordData = wordData
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