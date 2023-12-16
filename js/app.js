// Function to get a selected value from a radio group
function getSelectedValueFromRadioGroup(radioGroupName) {
    try { return document.querySelector(`input[name="${radioGroupName}"]:checked`).value; }
    catch (error) {
        console.log("🚀 ~ file: global.js:545 ~ getSelectedValueFromRadioGroup ~ radioGroupName:", radioGroupName)
        console.error("🚀 ~ file: global.js:547 ~ getSelectedValueFromRadioGroup ~ error:", error)
    }
}
// Function to reverse a string
function reverse(string){
    return string.split('').reverse().join('');
}
// Function to get a random integer
// Source: https://www.w3schools.com/js/js_random.asp
function getRndInteger(min, max) {
    return parseInt(Math.floor(Math.random() * (max + 1 - min)) + min);
}
// Function to make a toast using Toastify (https://github.com/apvarun/toastify-js/blob/master/README.md)
// function makeToast(content, type){
//     let backgroundColor
//     if (type === 'success') backgroundColor = '#166534' 
//     else if (type === 'warning') backgroundColor = '#fde047'
//     else if (type === 'error') backgroundColor = '#b91c1c'
//     let color 
//     if (type === 'success') color = '#fff' 
//     else if (type === 'warning') color = '#000'
//     else if (type === 'error') color = '#fff'
//     Toastify({
//         text: content,
//         offset: {
//             x: 10,
//             y: 10
//         },
//         gravity: "bottom",
//         position: "left",
//         style: {
//             background: backgroundColor,
//             color: color,
//             zIndex: 1000
//         },
//         escapeMarkup: false,
//     }).showToast()
// }
let lastToastTime = 0;
const toastDebounceDelay = 3000; // 2 seconds, adjust as needed

function makeToast(content, type) {
    const now = Date.now();

    if (now - lastToastTime > toastDebounceDelay || lastToastTime === 0) {
        // If it's the first toast or enough time has passed since the last toast
        lastToastTime = now;
        showToast(content, type);
    } else {
        // If the toast is triggered too soon, delay it
        clearTimeout(toastDebounceTimer);
        toastDebounceTimer = setTimeout(() => {
            lastToastTime = Date.now();
            showToast(content, type);
        }, toastDebounceDelay - (now - lastToastTime));
    }
}

function showToast(content, type) {
    let backgroundColor;
    if (type === 'success') backgroundColor = '#166534';
    else if (type === 'warning') backgroundColor = '#fde047';
    else if (type === 'error') backgroundColor = '#b91c1c';

    let color;
    if (type === 'success') color = '#fff';
    else if (type === 'warning') color = '#000';
    else if (type === 'error') color = '#fff';

    Toastify({
        text: content,
        offset: {
            x: 10,
            y: 10
        },
        gravity: "bottom",
        position: "left",
        style: {
            background: backgroundColor,
            color: color,
            zIndex: 1000
        },
        escapeMarkup: false,
    }).showToast();
}

// Function to format milliseconds into 0h 0m 0s
function formatMillisecondsToReadable(milliseconds){
    if (milliseconds < 1000) return `${milliseconds}ms`
    const hours = Math.floor(milliseconds / 3600000); // 1 hour = 3600000 ms
    const minutes = Math.floor((milliseconds % 3600000) / 60000); // 1 minute = 60000 ms
    const seconds = Math.floor((milliseconds % 60000) / 1000); // 1 second = 1000 ms
    return `${hours}h ${minutes}m ${seconds}s`;
}
function splitAtFirst(str, char) {
    const index = str.indexOf(char)
    if (index === -1) return [str]
    return [str.substring(0, index), str.substring(index + 1)]
}
function checkSelectedRadioButtonsInGroup(radioGroupName, arrayOfCheckedButtons){
    if (radioGroupName.includes('crossword')) arrayOfCheckedButtons = arrayOfCheckedButtons.map(i => `${i}-crossword`)
    let radios = document.getElementsByName(radioGroupName)
    for (let index = 0; index < radios.length; index++) {
        let element = radios[index];
        let id = element.id
        let value = element.value
        if (arrayOfCheckedButtons.includes(id) || arrayOfCheckedButtons.includes(value)) element.checked = true
        else element.checked = false
    }
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}
function getRandomArrayElement(array){
    return array[Math.floor(Math.random() * array.length)]
}
// Increment and Decrement Buttons
function decrement(e) {
    e.preventDefault() // Prevent the form from doing its thing
    const btn = e.target.parentNode.parentElement.querySelector('button[data-action="decrement"]');
    let targetSize
    if (btn.name == 'width') targetSize = WORD_SEARCH_MIN_COL_SIZE
    else if (btn.name == 'height') targetSize = WORD_SEARCH_MIN_ROW_SIZE
    const target = btn.nextElementSibling;
    let value = Number(target.value);
    if (value - 1 < targetSize) return makeToast(`Cannot be less than ${targetSize}!`, `error`)
    value--;
    target.value = value;
}
function increment(e) {
    e.preventDefault() // Prevent the form from doing its thing
    const btn = e.target.parentNode.parentElement.querySelector('button[data-action="decrement"]');
    let targetSize
    if (btn.name == 'width') targetSize = WORD_SEARCH_MAX_COL_SIZE
    else if (btn.name == 'height') targetSize = WORD_SEARCH_MAX_ROW_SIZE
    const target = btn.nextElementSibling;
    let value = Number(target.value);
    if (value + 1 > targetSize) return makeToast(`Cannot be greater than ${targetSize}!`, `error`)
    value++;
    target.value = value;
}
const decrementButtons = document.querySelectorAll(`button[data-action="decrement"]`);
const incrementButtons = document.querySelectorAll(`button[data-action="increment"]`);
decrementButtons.forEach(btn => {
    btn.addEventListener("click", decrement);
});
incrementButtons.forEach(btn => {
    btn.addEventListener("click", increment);
});
document.addEventListener("DOMContentLoaded", function () {
    // Toggle Modal
    const toggleButtons = document.querySelectorAll("[data-modal-toggle]");
    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const modalId = this.getAttribute("data-modal-toggle");
            if (modalId === 'save-preset-modal') {
                let selectedPreset = (localStorage.getItem('clicked-preset') == 'word-search-presets') ? document.getElementById('presets-dropdown').value : document.getElementById('presets-dropdown-crossword').value
                if (selectedPreset !== 'load') {
                    let modal = document.getElementById('overwrite-preset-modal')
                    modal.classList.toggle('hidden')
                    let displayPresetName = document.getElementById('update-preset-name')
                    displayPresetName.innerText = selectedPreset
                } else {
                    const modal = document.getElementById(modalId);
                    modal.classList.toggle("hidden");
                }
            }
            else if (modalId === 'delete-preset-modal'){
                let selectedPreset = (localStorage.getItem('clicked-preset') == 'word-search-presets') ? document.getElementById('presets-dropdown').value : document.getElementById('presets-dropdown-crossword').value
                if (selectedPreset === 'load') {
                    return makeToast('Please select a preset before deleting!', 'warning')
                } else {
                    let displayPresetName = document.getElementById('delete-confirmation-preset')
                    displayPresetName.innerText = selectedPreset
                    const modal = document.getElementById(modalId);
                    modal.classList.toggle("hidden");
                }
            } else {
                const modal = document.getElementById(modalId);
                modal.classList.toggle("hidden");
            }
        });
    });
    // Show Modal
    const showButtons = document.querySelectorAll("[data-modal-show]");
    showButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const modalId = this.getAttribute("data-modal-toggle");
            if (modalId === 'save-preset-modal') {
                let selectedPreset = (localStorage.getItem('clicked-preset') == 'word-search-presets') ? document.getElementById('presets-dropdown').value : document.getElementById('presets-dropdown-crossword').value
                if (selectedPreset !== 'load') {
                    let modal = document.getElementById('overwrite-preset-modal')
                    modal.classList.toggle('hidden')
                    let displayPresetName = document.getElementById('update-preset-name')
                    displayPresetName.innerText = selectedPreset
                } else {
                    const modal = document.getElementById(modalId);
                    modal.classList.toggle("hidden");
                }
            }
            else if (modalId === 'delete-preset-modal'){
                let selectedPreset = (localStorage.getItem('clicked-preset') == 'word-search-presets') ? document.getElementById('presets-dropdown').value : document.getElementById('presets-dropdown-crossword').value
                if (selectedPreset === 'load') {
                    return makeToast('Please select a preset before deleting!', 'warning')
                } else {
                    let displayPresetName = document.getElementById('delete-confirmation-preset')
                    displayPresetName.innerText = selectedPreset
                    const modal = document.getElementById(modalId);
                    modal.classList.toggle("hidden");
                }
            } else {
                const modal = document.getElementById(modalId);
                modal.classList.toggle("hidden");
            }
        });
    });
    // Hide Modal
    const hideButtons = document.querySelectorAll("[data-modal-hide]");
    hideButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const modalId = this.getAttribute("data-modal-hide");
            const modal = document.getElementById(modalId);
            modal.classList.add("hidden");
        });
    });


    let savePreset = document.getElementById('save-preset')
    savePreset.addEventListener('click', function(){
        let preset = localStorage.getItem('clicked-preset')
        let modal = document.getElementById('save-preset-modal')
        let name = document.getElementById('name').value
        if (!name) return makeToast("Please enter a name.", 'error')
        let params = (preset === 'word-search-presets') ? getWordSearchParams() : getCrosswordParams()
        let presets = JSON.parse(localStorage.getItem(preset))
        presets.push({name: name, params: params})
        localStorage.setItem(preset, JSON.stringify(presets))
        modal.classList.add('hidden')
        document.getElementById('name').value = ''
        makeToast(`<b>${name}</b> preset saved successfully!`, 'success')
        if (preset === 'word-search-presets') refreshPresetDropdown()
        else refreshPresetDropdownCrossword()
    })
    let deletePreset = document.getElementById('confirm-delete-preset')
    deletePreset.addEventListener('click', function(){
        let preset = localStorage.getItem('clicked-preset')
        let presets = JSON.parse(localStorage.getItem(preset))
        let selectedPreset = (preset === 'word-search-presets') ? document.getElementById('presets-dropdown').value : document.getElementById('presets-dropdown-crossword').value
        presets = presets.filter(item => item.name !== selectedPreset)
        localStorage.setItem(preset, JSON.stringify(presets))
        if (preset === 'word-search-presets') refreshPresetDropdown()
        else refreshPresetDropdownCrossword()
        makeToast(`<b>${selectedPreset}</b> deleted successfully!`, 'success')
    })
    let updatePreset = document.getElementById('update-preset')
    updatePreset.addEventListener('click', function(){
        let preset = localStorage.getItem('clicked-preset')
        let params = (preset === 'word-search-presets') ? getWordSearchParams() : getCrosswordParams()
        let presets = JSON.parse(localStorage.getItem(preset))
        let selectedPreset = (preset === 'word-search-presets') ? document.getElementById('presets-dropdown').value : document.getElementById('presets-dropdown-crossword').value
        let updatePreset = presets.find(item => item.name === selectedPreset)
        updatePreset = {name: selectedPreset, params: params}
        presets = presets.filter(item => item.name !== selectedPreset)
        presets.push(updatePreset)
        localStorage.setItem(preset, JSON.stringify(presets))
        makeToast(`${selectedPreset} updated successfully!`, 'success')
    })
});