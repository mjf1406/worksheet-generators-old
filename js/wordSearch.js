const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const WORD_RE = /^[a-z]+$/
const COLORS = ['#f87171','#fde047','#4ade80','#60a5fa','#c084fc','#f472b6','#f43f5e','#0d9488','#fb923c']
const DELTAS = {
    'left-to-right': [0, 1],
    'right-to-left': [0, -1],
    'bottom-to-top': [-1, 0],
    'top-to-bottom': [1, 0],
    'diagonal-down-left': [1, -1],
    'diagonal-down-right': [1, 1],
    'diagonal-up-right': [-1, 1],
    'diagonal-up-left': [-1, -1]
}
const DIRECTION_ICONS = {
    'left-to-right': '<i class="fa-solid fa-arrow-right"></i>',
    'right-to-left': '<i class="fa-solid fa-arrow-left"></i>',
    'bottom-to-top': '<i class="fa-solid fa-arrow-up"></i>',
    'top-to-bottom': '<i class="fa-solid fa-arrow-down"></i>',
    'diagonal-down-left': '<i class="rotate-45 fa-solid fa-arrow-down"></i>',
    'diagonal-down-right': '<i class="rotate-45 fa-solid fa-arrow-right"></i>',
    'diagonal-up-right': '<i class="rotate-45 fa-solid fa-arrow-up"></i>',
    'diagonal-up-left': '<i class="rotate-45 fa-solid fa-arrow-left"></i>'
}
if(!localStorage.getItem('word-search-data')) {
    const params = {
        title: "Title", // Any alphanumeric string
        height: 10, // Any positive integer
        width: 10,  // Any positive integer
        letterCase: "uppercase", // uppercase, lowercase, upper-lower-case
        orientation: "orthogonal", // orthogonal, diagonal, orthogonal-diagonal
        direction: "forward", // forward, backward, forward-backward
        page: "a4", // a4, letter,
        key: true // Boolean
    }
    localStorage.setItem('word-search-data', JSON.stringify(params))
}
if (JSON.parse(localStorage.getItem('word-search-presets'))) {
    refreshPresetDropdown()
} else {
    let presetsDropdown = document.getElementById('presets-dropdown')
    let option = document.createElement('option')
    option.innerText = 'Select preset...'
    option.value = 'load'
    presetsDropdown.appendChild(option)
}
// Tooltips
tippy('#label-backward', {
    content: "Backward"
})
tippy('#label-forward', {
    content: "Forward"
})
tippy('#label-forward-backward', {
    content: "Forward & Backward"
})
tippy('#label-uppercase', {
    content: "UPPERCASE"
})
tippy('#label-lowercase', {
    content: "lowercase"
})
tippy('#label-random-case', {
    content: "RAnDom cASe"
})
tippy('#sections-help', {
    content: "Splits the word search into equal sized sections."
})
tippy('#reveal-sections-help', {
    content: "Displays the section number of each word in the word bank."
})
tippy('#reveal-direction-help', {
    content: `Displays the direction of each word in the word bank using arrows.`,
    allowHTML: true
})
let title = document.getElementById('title')
let height = document.getElementById('height')
let width = document.getElementById('width')
let sections = document.getElementById('sections')
let revealSections = document.getElementById('reveal-section')
let letterCase = getSelectedValueFromRadioGroup('letter-case')
let wordDirections = document.getElementsByName('word-direction')
let directions = []
for (let index = 0; index < wordDirections.length; index++) {
    const element = wordDirections[index];
    if (element.checked) directions.push(element.id)
}
let revealDirection = document.getElementById('reveal-direction')
let page = getSelectedValueFromRadioGroup('page-size')
let key = document.getElementById('key')
let words = document.getElementById('words')
let previewButton = document.getElementById('preview')
let savePreset = document.getElementById('open-preset')
let deletePreset = document.getElementById('delete-preset')
let presetsDropdown = document.getElementById('presets-dropdown')
let updatePreset = document.getElementById('update-preset')
let wordBank = document.getElementById('word-bank')
let download = document.getElementById('download')
const radios = document.querySelectorAll(`input[type="radio"]`)
previewButton.addEventListener('click', function(){
    let start = new Date().getTime(); 
    let params = getWordSearchParams()
    if (params.words.length === 0) return makeToast("Please add some words!", 'warning')
    let wordSearchData = generateWordSearch(params)
    if (typeof wordSearchData === 'object' || wordSearchData instanceof Object) { 
        updateWordSearchPreview(wordSearchData)
        updateWordBank(wordSearchData)
        let end = new Date().getTime(); 
        makeToast(`Word Search generated in ${formatMillisecondsToReadable(end - start)}`, 'success')
    }
})
savePreset.addEventListener('click', function(){
    localStorage.setItem('clicked-preset','word-search-presets')
})
deletePreset.addEventListener('click', function(){
    localStorage.setItem('clicked-preset','word-search-presets')
})
presetsDropdown.addEventListener('change', function(){
    let selectedPreset = this.value
    if (selectedPreset === 'load') return
    let preset = getPresetData(selectedPreset).params
    populateOptionsFromPreset(preset)
    makeToast(`<b>${selectedPreset}</b> loaded successfully!`, 'success')
})
download.addEventListener('click', function(){
    const wordSearchData = JSON.parse(localStorage.getItem('word-search-data'))
    const page = wordSearchData.page
    const unit = (page === 'a4') ? 'mm' : 'in' 
    const title = document.getElementById('title').value ? document.getElementById('title').value : "No Title"
    const worksheet = document.getElementById('word-search-worksheet')

    const width = (page === 'a4') ? 595 : 612 // DPI = 72
    const height = (page === 'a4') ? 842 : 792 // DPI = 72

    var opt = {
        margin:       [1, 1, 1, 1], // top, right, bottom, left
        filename:     'myfile.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 4, scrollX: 0, scrollY: 0, width: width, height: height },
        jsPDF:        { unit: unit, format: page, orientation: 'portrait' }
    };
    html2pdf().set(opt).from(worksheet).save(`[Word Search] ${title}.pdf`)
})
function getWordSearchParams(){
    let title = document.getElementById('title').value
    let height = document.getElementById('height').value
    let width = document.getElementById('width').value
    let sections = document.getElementById('sections').value
    let revealSections = document.getElementById('reveal-section').checked
    let letterCase = getSelectedValueFromRadioGroup('letter-case')
    let wordDirections = document.getElementsByName('word-direction')
    let directions = []
    for (let index = 0; index < wordDirections.length; index++) {
        const element = wordDirections[index];
        if (element.checked) directions.push(element.id)
    }
    let revealDirection = document.getElementById('reveal-direction').checked
    let page = getSelectedValueFromRadioGroup('page-size')
    let key = document.getElementById('key').checked
    let words = document.getElementById('words').value
    if (words.includes(",")) words = words.split(", ")
    else if (words.includes("\n")) words = words.split("\n")
    const params = {
        title: title, // Any alphanumeric string
        height: height, // Any positive integer
        width: width,  // Any positive integer
        letterCase: letterCase, // uppercase, lowercase, upper-lower-case
        directions: directions, // orthogonal, diagonal, orthogonal-diagonal
        page: page, // a4, letter,
        key: key, // Boolean
        sections: sections,
        revealSections: revealSections,
        revealDirection, revealDirection,
        words: words
    }
    return params
}
// Update Preset Dropdown
function refreshPresetDropdown(){
    let presets = JSON.parse(localStorage.getItem('word-search-presets'))
    let presetsDropdown = document.getElementById('presets-dropdown')
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
function getPresetData(presetName){
    let presets = JSON.parse(localStorage.getItem('word-search-presets'))
    return presets.find(item => item.name === presetName)
}
function populateOptionsFromPreset(presetOptions){
    title.value = presetOptions.title
    height.value = presetOptions.height
    width.value = presetOptions.width
    sections.value = presetOptions.sections
    if (presetOptions.revealSections) revealSections.checked = true
    else revealSections.checked = false
    checkSelectedRadioButtonsInGroup('letter-case', [presetOptions.letterCase])
    checkSelectedRadioButtonsInGroup('word-direction', presetOptions.directions)
    if (presetOptions.revealDirection) revealDirection.checked = true
    else revealDirection.checked = false
    checkSelectedRadioButtonsInGroup('page-size', [presetOptions.page])
    if (presetOptions.key) key.checked = true
    else key.checked = false
}
// radios.forEach(radio => { radio.addEventListener('change', saveWordSearch) });
function adjustCase(wordData, letterCase){
    if (letterCase === "lowercase") {
        for (let index = 0; index < wordData.length; index++) {
            let word = wordData[index].word;
            wordData[index].word = word.toLowerCase()
        }
    } else if (letterCase === "uppercase") {
        for (let index = 0; index < wordData.length; index++) {
            let word = wordData[index].word;
            wordData[index].word = word.toUpperCase()
        }
    } else if (letterCase === "random-case") {
        for (let index = 0; index < wordData.length; index++) {
            let newWord = []
            let word = wordData[index].word;
            word = word.split("")
            for (let index = 0; index < word.length; index++) {
                let letter = word[index];
                let randCase = getRndInteger(0 ,1)
                if (randCase == 0) letter = letter.toUpperCase()
                else letter = letter.toLowerCase()
                newWord.push(letter)
            }
            wordData[index].word = newWord.join("")
        }
    }
    return wordData
}
function determineSections(wordData, height, width, sections){
    // TODO: determineSections
    let sectionWidth = Math.floor(width / sections)
    let sectionHeight = Math.floor(height / sections)

    for (let index = 0; index < wordData.length; index++) {
        let element = wordData[index];
        let coords = element.coords
        let sections = []
        for (let index = 0; index < coords.length; index++) {
            let coord = coords[index];
            let x = coord.x
            let y = coord.y
            sections.push(x + 1 % sectionWidth)
            sections.push(y + 1 % sectionHeight)
        }
        wordData[index].sections = sections
    }

    // Paint borders
    // for (let index = 0; index < height; index += sectionHeight) {
    //     for (let x = 0; x < width; x++) {
    //         let div = document.getElementById('')      
    //     }
    // }
    // for (let x = 0; x < width; x += sectionWidth) {
    //     for (let y = 0; y < height; y++) {
    //         let div = document.getElementById('') 
    //     }
    // }

    return wordData
}
// Takes a JSON as its one argument
const params = {
    title: "a", // Any alphanumeric string
    height: 10, // Any positive integer
    width: 10,  // Any positive integer
    letterCase: "upper", // uppercase, lowercase, upper-lower-case
    direction: "forward", // forward, backward, forward-backward
    page: "a4", // a4, letter,
    key: true, // Boolean
    words: [] // Array of the words
}
function generateWordSearch(params){
    let height = parseInt(params.height)
    let width = parseInt(params.width)
    const MAX_ATTEMPTS = height * width
    let letterCase = params.letterCase
    let directions = params.directions
    let words = params.words
    let sections = parseInt(params.sections)
    let wordData = words.map(word => { return { word: word } })
    // Error Handling
    let invalidWordLength = false
    for (let index = 0; index < words.length; index++) {
        const word = words[index];
        if (word.length > width && word.length > height) {
            invalidWordLength = true
            if (invalidWordLength) makeToast("One or more of your words is longer than the word search width and height. Please ensure yours words are shorter than at least one of the dimensions.", 'error')
            if (invalidWordLength) break
        }
    }
    if (invalidWordLength) return "Error: Invalid word length"
    // Answer Key
    let answerKey = new Array(width)
    for (let index = 0; index < answerKey.length; index++) {
        answerKey[index] = new Array(height)        
    }
    // Grid
    let grid = new Array(width)
    for (let index = 0; index < grid.length; index++) {
        grid[index] = new Array(height)        
    }
    // Modify Words
    wordData = adjustCase(wordData, letterCase)
    // Place words
    function placeLetter(direction, x1, y1, letterIndex, grid, letterCoords, letter, answerKey) {
        const [dx, dy] = DELTAS[direction];
        const x = x1 + dx * letterIndex;
        const y = y1 + dy * letterIndex;
        if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
            return false
        }
        const charAtCoordInGrid = grid[x][y]
        const charAtCoordInAnswerKey = answerKey[x][y]
        // Empty grid tile
        if (charAtCoordInGrid === undefined && charAtCoordInAnswerKey === undefined) {
            grid[x][y] = letter
            letterCoords.push( { x, y } )
            return true
        }
        // Overlapping letters
        else if (charAtCoordInGrid === letter && charAtCoordInAnswerKey === letter) {
            letterCoords.push({ x, y })
            return true
        }
        return false
    }
    for (let wordIndex = 0; wordIndex < wordData.length; wordIndex++) {
        let word = wordData[wordIndex].word
        let attempt = 1
        let wordPlaced = false
        while (attempt <= MAX_ATTEMPTS && wordPlaced === false) {
            let direction = directions[Math.floor(Math.random() * directions.length)]
            wordData[wordIndex].direction = direction
            let letterCoords = []
            let wordLength = word.length
            let x1 = getRndInteger(0, width - 1)
            let y1 = getRndInteger(0, height - 1)
            let lettersPlaced = 0
            for (let letterIndex = 0; letterIndex < wordLength; letterIndex++) {
                const letter = word[letterIndex];
                if (!placeLetter(direction, x1, y1, letterIndex, grid, letterCoords, letter, answerKey)) {
                    break
                }
                lettersPlaced += 1
            }
            if (wordLength === lettersPlaced) wordPlaced = true
            if (wordPlaced === true) {
                for (let index = 0; index < letterCoords.length; index++) {
                    const element = letterCoords[index];    
                    answerKey[element.x][element.y] = grid[element.x][element.y]
                }    
                wordData[wordIndex].coords = letterCoords            
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
    // Add filler characters
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let charAtCoord = grid[x][y] != undefined ? true : false // Check to see if there is a character at these coords
            if (charAtCoord) continue // Skip these coords because there's a character 
            let randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)]
            if (letterCase === 'uppercase') randomLetter = randomLetter.toUpperCase()
            else if (letterCase === 'random-case') {
        let roll = getRndInteger(0,1)
        if (roll === 0) randomLetter = randomLetter.toUpperCase()
    }
            grid[x][y] = randomLetter // Get a random letter and place it
        }
    }
    // wordData = determineSections(wordData, height, width, sections) // TODO: Do this
    params.wordData = wordData
    params.grid = grid
    params.key = answerKey
    return params
}

function updateWordSearchPreview(wordSearchData){
    const titleElement = document.getElementById('word-search-title')
    const preview = document.getElementById('preview-word-search')
    preview.innerHTML = ''
    
    let height = wordSearchData.height
    let width = wordSearchData.width
    let grid = wordSearchData.grid
    let answerKey = wordSearchData.key
    let wordData = wordSearchData.wordData
    let title = wordSearchData.title

    titleElement.innerText = title
    preview.style.gridTemplateColumns = `repeat(${width}, minmax(0, 1fr))`
    preview.classList.remove('grid-cols-7')

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // let isWordCoord = answerKey[x][y] === 1 ? true : false
            let isWordCoord = answerKey[x][y] ? true : false
            let div = document.createElement('div')
            div.innerText = grid[x][y]
            div.id = `${x}-${y}`
            div.classList.add('text-center')
            div.classList.add('w-7')
            div.classList.add('h-7')
            div.classList.add('text-sm')
            if (isWordCoord) { 
                div.classList.add('text-black')
                div.innerText = answerKey[x][y]
            }
            preview.appendChild(div)
        }
    }
    // Reveal Answers
    for (let index = 0; index < wordData.length; index++) {
        const element = wordData[index]
        let coords = element.coords
        let color = COLORS[Math.floor(Math.random() * COLORS.length)]
        if (coords) {
            for (let index = 0; index < coords.length; index++) {
                const element = coords[index];
                let div = document.getElementById(`${element.x}-${element.y}`)
                // div.style.background = color
                // div.classList.add(`bg-[${color}]`)
            }
        }
    }
}
function updateWordBank(wordSearchData){
    wordBank.innerHTML = ''
    let wordData = wordSearchData.wordData
    wordData = wordData.sort((a, b) => a.word.localeCompare(b.word));
    let revealDirection = wordSearchData.revealDirection
    let revealSections = wordSearchData.revealSections
    for (let index = 0; index < wordData.length; index++) {
        let element = wordData[index]
        let word = element.word
        let direction = element.direction
        // let section = element.section

        let div = document.createElement('div')
        let sectionDiv = document.createElement('div')
        let directionDiv = document.createElement('div')
        let wordDiv = document.createElement('div')

        div.classList.add('flex')
        div.classList.add('flex-row')
        div.classList.add('gap-2')
        div.classList.add('text-xs')

        // sectionDiv.innerHTML = `<b>${section}</b>`
        directionDiv.innerHTML = DIRECTION_ICONS[direction]
        wordDiv.innerHTML = `<b>${word}</b>`

        if(revealSections) div.appendChild(sectionDiv)
        if(revealDirection) div.appendChild(directionDiv)
        div.appendChild(wordDiv)
        wordBank.appendChild(div)
    }
}