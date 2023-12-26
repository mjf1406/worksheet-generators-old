const difficultyRadios = document.getElementsByName('difficulty')
difficultyRadios.forEach(element => {
    element.addEventListener('change', function(){
        let selectedDifficulty = getSelectedValueFromRadioGroup('difficulty')
        const totalCommandsInput = document.getElementById('total-commands-input')
        const commandsVarietyInput = document.getElementById('commands-variety-input')
        if (selectedDifficulty != 'custom-difficulty') {
            totalCommandsInput.classList.add('hidden')
            commandsVarietyInput.classList.add('hidden')
        } else {
            totalCommandsInput.classList.remove('hidden')
            commandsVarietyInput.classList.remove('hidden')
        }
    })
});

let selectedDifficulty = getSelectedValueFromRadioGroup('difficulty')
const totalCommandsInput = document.getElementById('total-commands-input')
const commandsVarietyInput = document.getElementById('commands-variety-input')
if (selectedDifficulty != 'custom-difficulty') {
    totalCommandsInput.classList.add('hidden')
    commandsVarietyInput.classList.add('hidden')
} else {
    totalCommandsInput.classList.remove('hidden')
    commandsVarietyInput.classList.remove('hidden')
}