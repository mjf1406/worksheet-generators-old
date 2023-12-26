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
// Function to get a selected value from a radio group
function getSelectedValueFromRadioGroup(radioGroupName) {
    try { return document.querySelector(`input[name="${radioGroupName}"]:checked`).value; }
    catch (error) {
        console.log("🚀 ~ file: global.js:545 ~ getSelectedValueFromRadioGroup ~ radioGroupName:", radioGroupName)
        console.error("🚀 ~ file: global.js:547 ~ getSelectedValueFromRadioGroup ~ error:", error)
    }
}