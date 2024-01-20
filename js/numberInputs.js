const MAXIMUM_HEIGHT = 25
const MAXIMUM_WIDTH = 30
const MINIMUM_HEIGHT = 4
const MINIMUM_WIDTH = 4
const ADJUSTMENT_VALUE = 1

// Increment and Decrement Buttons
function decrement(e) {
    e.preventDefault();
    let targetSize, adjustmentValue

    const btn = e.target.closest('button[data-action="decrement"]');

    targetSize = 1
    adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : 1

    if (btn.name === 'height') {
        targetSize = MINIMUM_HEIGHT;
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : ADJUSTMENT_VALUE;
    }
    if (btn.name === 'width') {
        targetSize = MINIMUM_WIDTH;
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : ADJUSTMENT_VALUE;
    }

    const target = btn.nextElementSibling;
    let value = Number(target.value);
    if (value - adjustmentValue < targetSize) {
        return makeToast(`<b>${btn.name.toTitleCase()}</b> cannot be less than ${targetSize}!`, `error`);
    }
    value -= adjustmentValue;
    target.value = value;
}

function increment(e) {
    e.preventDefault();
    let targetSize, adjustmentValue

    const btn = e.target.closest('button[data-action="increment"]');
    
    adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : 1

    if (btn.name === 'height') {
        targetSize = MAXIMUM_HEIGHT;
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : ADJUSTMENT_VALUE;
    }
    if (btn.name === 'width') {
        targetSize = MAXIMUM_WIDTH;
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : ADJUSTMENT_VALUE;
    }

    const target = btn.previousElementSibling;
    let value = Number(target.value);
    if (value + adjustmentValue > targetSize) {
        return makeToast(`<b>${btn.name.toTitleCase()}</b> cannot be greater than ${targetSize}!`, `error`);
    }
    value += adjustmentValue;
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