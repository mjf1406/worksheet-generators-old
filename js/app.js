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
function updatePreview(data, previewElementId, size){
    const titleElement = document.getElementById('worksheet-title')
    const preview = document.getElementById(previewElementId)
    preview.innerHTML = ''
    
    let height = data.height
    let width = data.width
    let grid = data.grid
    let answerKey = data.key
    let wordData = data.wordData
    let title = data.title

    titleElement.innerText = title
    preview.style.gridTemplateColumns = `repeat(${width}, minmax(0, 1fr))`
    preview.classList.remove('grid-cols-7')

    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
            let isWordCoord = false
            if (answerKey.length > 0) isWordCoord = answerKey[x][y] ? true : false

            let div = document.createElement('div')
            div.innerText = grid[x][y]
            div.id = `${x}-${y}`
            div.setAttribute('name', 'letter')
            div.classList.add('text-center')
            div.classList.add('p-px')
            // div.classList.add('bg-transparent')
            div.classList.add(`cell-${size}`)
            if (isWordCoord) { 
                div.innerText = answerKey[x][y]
            }
            preview.appendChild(div)
        }
    }
    if (previewElementId.includes('crossword')) return
}
function setDate(elementId){
    const date = new Date()
    const dateString = date.toLocaleDateString()
    // const timeString = date.toLocaleTimeString()
    const element = document.getElementById(elementId)
    // element.innerText = `${dateString} ${timeString}`
    element.innerText = `${dateString}`
}