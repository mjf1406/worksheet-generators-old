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
const SECTIONS = {
    "four": {
        rows: 2,
        cols: 2,
        num: 4
    },
    "nine": {
        rows: 3,
        cols: 3,
        num: 9
    },
    "twelve": {
        rows: 3,
        cols: 4,
        num: 12
    },
    "sixteen": {
        rows: 4,
        cols: 4,
        num: 16
    }
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
let wordDirectionAllButton = document.getElementById('select-all-directions')
let wordsInput = document.getElementById('words')
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
const downloadButton = document.getElementById('download')
const printButton = document.getElementById('print')
const radios = document.querySelectorAll(`input[type="radio"]`)




wordDirectionAllButton.addEventListener('click', function(event){
    const wordSearchForm = document.getElementById('word-search-form')
    event.preventDefault()
    const directionButtons = document.getElementsByName('word-direction')
    let allDirectionsChecked = (localStorage.getItem('all-directions')) ?? false 
    directionButtons.forEach(element => {
        if (allDirectionsChecked === 'false') element.checked = true
        else element.checked = false
    })
    if (allDirectionsChecked === 'false') localStorage.setItem('all-directions', true)
    else localStorage.setItem('all-directions', false)
})
previewButton.addEventListener('click', function(){
    let start = new Date().getTime()
    let revealSections = document.getElementById('reveal-section').checked
    let params = getWordSearchParams()
    if (params.words.length === 0) return makeToast("Please add some words!", 'warning')
    let wordSearchData = generateWordSearch(params)
    if (typeof wordSearchData === 'object' || wordSearchData instanceof Object) { 
        updateWordSearchPreview(wordSearchData)
        updateWordBank(wordSearchData)
        updateWordStats()
        if (revealSections) paintSections(wordSearchData.sections)
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
wordsInput.addEventListener('input', function(){
    const rowsInput = document.getElementById('height')
    const colsInput = document.getElementById('width')
    const height = parseInt(rowsInput.value)
    const width = parseInt(colsInput.value)
    const longestLength = updateWordStats()
    if (rowsInput.value < longestLength) {
        rowsInput.value = longestLength
        makeToast(`Rows set to ${longestLength}`, `warning`)
    }
    if (colsInput.value < longestLength) {
        colsInput.value = longestLength
        makeToast(`Columns set to ${longestLength}`, `warning`)

    }
})
downloadButton.addEventListener('click', function(){
    const wordSearchData = JSON.parse(localStorage.getItem('word-search-data'))
    const title = document.getElementById('title').value ? document.getElementById('title').value : "No Title"
    const worksheet = document.getElementById('word-search-worksheet')
    const opt = getPdfOptions(wordSearchData)
    html2pdf().set(opt).from(worksheet).save(`[Word Search] ${title}.pdf`)
    updateWordStats()
})
printButton.addEventListener('click', function(){
    const wordSearchData = JSON.parse(localStorage.getItem('word-search-data'));
    const title = document.getElementById('title').value ? document.getElementById('title').value : "No Title";
    const worksheet = document.getElementById('word-search-worksheet');
    const opt = getPdfOptions(wordSearchData);

    html2pdf().from(worksheet).toPdf().get('pdf').then(function (doc) {
        doc.autoPrint();

        const hiddenFrame = document.createElement('iframe');
        hiddenFrame.style.position = 'fixed';
        // "visibility: hidden" would trigger safety rules in some browsers like safari，
        // in which the iframe display in a pretty small size instead of hidden.
        // here is some little hack ~
        hiddenFrame.style.width = '1px';
        hiddenFrame.style.height = '1px';
        hiddenFrame.style.opacity = '0.01';
        const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
        if (isSafari) {
        // fallback in safari
        hiddenFrame.onload = () => {
            try {
            hiddenFrame.contentWindow.document.execCommand('print', false, null);
            } catch (e) {
            hiddenFrame.contentWindow.print();
            }
        };
        }
        hiddenFrame.src = doc.output('bloburl');
        document.body.appendChild(hiddenFrame);
    });
});




function updateWordStats(){
    const text = document.getElementById('words').value
    const words = (text.includes(", ")) ? text.split(", ") : text.split("\n")
    const stats = computeWordStatistics(words)
    document.getElementById('longest-word').innerText = `${stats.longestWord.length} - ${stats.longestWord.element}`
    document.getElementById('shortest-word').innerText = `${stats.shortestWord.length} - ${stats.shortestWord.element}`
    document.getElementById('word-count').innerText = stats.wordCount
    document.getElementById('avg-word-length').innerText = stats.avgLength
    return stats.longestWord.length
}
function getPdfOptions(wordSearchData){
    const page = wordSearchData.page
    const unit = (page === 'a4') ? 'mm' : 'in' 
    let width = (page === 'a4') ? 595 : 612 // DPI = 72
    let height = (page === 'a4') ? 842 : 792 // DPI = 72
    width = width * 0.7
    height = height * 0.7
    return {
        margin:       [1, 1, 1, 1], // top, right, bottom, left
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 8, scrollX: 0, scrollY: 0, width: width, height: height, logging: false },
        jsPDF:        { unit: unit, format: page, orientation: 'portrait' }
    };
}
function getWordSearchParams(){
    let title = document.getElementById('title').value
    let height = document.getElementById('height').value
    let width = document.getElementById('width').value
    let sections = getSelectedValueFromRadioGroup('sections')
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
        numberOfSections: sections,
        sections: [],
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
function computeSectionDimensions(params){
    const height = params.height
    const width = params.width
    const wordData = params.wordData
    const sections = params.sections
    const numberOfSectionsWord = params.numberOfSections
    const cols = SECTIONS[numberOfSectionsWord].cols
    const rows = SECTIONS[numberOfSectionsWord].rows
    const numberOfSections = SECTIONS[numberOfSectionsWord].num
    const sectionWidth = Math.floor(width / cols)
    const sectionHeight = Math.floor(height / rows)

    // Section Dimensions
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        for (let colIdx = 0; colIdx < cols; colIdx++) {
            let xStart = sectionHeight * colIdx
            let xEnd = xStart + (sectionHeight - 1)
            let yStart = sectionWidth * rowIdx
            let yEnd = yStart + (sectionWidth - 1) 
            // The last column
            if (colIdx === cols - 1){
                xEnd = width - 1
            }
            // The last row
            if (rowIdx === rows - 1){
                yEnd = height - 1
            }
            sections.push({
                start: `${xStart}-${yStart}`,
                end: `${xEnd}-${yEnd}`,
            })
        }        
    }
    params.sections = sections
    return params
}
function paintSections(sections){
    console.log("Painting Sections...")
    const BG_GRAY = 'bg-gray-300'
    const BG_WHITE = 'bg-white'
    const SECTION_COLORS_FOUR = [BG_GRAY,BG_WHITE,BG_WHITE,BG_GRAY]
    const SECTION_COLORS_NINE = [BG_GRAY,BG_WHITE,BG_GRAY, BG_WHITE,BG_GRAY,BG_WHITE, BG_GRAY,BG_WHITE,BG_GRAY]
    const SECTION_COLORS_TWELVE = [BG_GRAY,BG_WHITE,BG_GRAY,BG_WHITE, BG_WHITE,BG_GRAY,BG_WHITE,BG_GRAY, BG_GRAY,BG_WHITE,BG_GRAY,BG_WHITE]
    const SECTION_COLORS_SIXTEEN = [BG_GRAY,BG_WHITE,BG_GRAY,BG_WHITE, BG_WHITE,BG_GRAY,BG_WHITE,BG_GRAY, BG_GRAY,BG_WHITE,BG_GRAY,BG_WHITE, BG_WHITE,BG_GRAY,BG_WHITE,BG_GRAY]
    const sectionDigit = sections.length
    const sectionWord = sectionDigitToSectionWord(sectionDigit).toUpperCase()
    const letters = document.getElementsByName('letter')

    for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
        const section = sections[sectionIdx];
        const start = section.start.split("-")
        const xStart = parseInt(start[0])
        const yStart = parseInt(start[1])
        const end = section.end.split("-")
        const xEnd = parseInt(end[0])
        const yEnd = parseInt(end[1])

        for (let index = 0; index < letters.length; index++) {
            const letter = letters[index];
            const coords = letter.id.split("-")
            const x = parseInt(coords[0])
            const y = parseInt(coords[1])
            if (x >= xStart
                && y >= yStart 
                && x <= xEnd 
                && y <= yEnd) {
                    letter.classList.add(eval(`SECTION_COLORS_${sectionWord}`)[sectionIdx])
                }
        }
    }
    console.log("Sections painted successfully!")
}
function determineWordSections(params){
    console.log("Determining each word's section(s)...")
    const words = params.words
    const sections = params.sections
    for (let index = 0; index < sections.length; index++) {
        const section = sections[index];
        const start = section.start.split("-")
        const xStart = start[0]
        const yStart = start[1]
        const end = section.end.split("-")
        const xEnd = end[0]
        const yEnd = end[1]

        for (let index = 0; index < words.length; index++) {
            const element = words[index];
            
        }
    }
    console.log("Each word's section has been determined successfully!")
    return params
}
function sectionDigitToSectionWord(digit){
    if (digit === 4) return "four"
    if (digit === 9) return "nine"
    if (digit === 12) return "twelve"
    if (digit === 16) return "sixteen"
}
function generateWordSearch(params){
    const revealSections = document.getElementById('reveal-section').checked
    let height = parseInt(params.height)
    let width = parseInt(params.width)
    const MAX_ATTEMPTS = height * width
    let letterCase = params.letterCase
    let directions = params.directions
    let words = params.words
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
    params.wordData = wordData
    params.grid = grid
    params.key = answerKey
    if (revealSections) { 
        params = computeSectionDimensions(params)
        params = determineWordSections(params)
    }
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
            div.setAttribute('name', 'letter')
            div.classList.add('text-center')
            div.classList.add('w-4')
            div.classList.add('h-4')
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