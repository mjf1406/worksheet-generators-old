const MINIMUM_ROTATION_DURATION = 1
const ROTATIONS_ADJUSTMENT_VALUE = 0.5
const TRANSITION_DURATION_ADJUSTMENT_VALUE = 1
const ROTATIONS_MINIMUM = 2

// Increment and Decrement Buttons
function decrement(e) {
    e.preventDefault();
    let targetSize, adjustmentValue

    const btn = e.target.closest('button[data-action="decrement"]');

    targetSize = 1
    adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : 1

    if (btn.name === 'rotation-duration') {
        targetSize = MINIMUM_ROTATION_DURATION;
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : ROTATIONS_ADJUSTMENT_VALUE;
    } else if (btn.name === 'rotation-transition-duration') {
        targetSize = MINIMUM_ROTATION_DURATION;
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : TRANSITION_DURATION_ADJUSTMENT_VALUE;
    } else if (btn.name === 'rotation-quantity') {
        targetSize = ROTATIONS_MINIMUM;
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : TRANSITION_DURATION_ADJUSTMENT_VALUE;
    }

    const target = btn.nextElementSibling;
    let value = Number(target.value);
    if (value - adjustmentValue < targetSize) {
        return makeToast(`Cannot be less than ${targetSize}!`, `error`);
    }
    value -= adjustmentValue;
    target.value = value;
}

function increment(e) {
    e.preventDefault();
    let targetSize, adjustmentValue

    const btn = e.target.closest('button[data-action="increment"]');
    
    adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : 1

    if (btn.name === 'rotation-duration') {
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : ROTATIONS_ADJUSTMENT_VALUE;
    } else if (btn.name === 'rotation-transition-duration') {
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : TRANSITION_DURATION_ADJUSTMENT_VALUE;
    } else if (btn.name === 'rotation-quantity') {
        adjustmentValue = e.ctrlKey ? 5 : e.shiftKey ? 10 : TRANSITION_DURATION_ADJUSTMENT_VALUE;
    }
    const target = btn.previousElementSibling;
    let value = Number(target.value);
    if (value + adjustmentValue > targetSize) {
        return makeToast(`Cannot be greater than ${targetSize}!`, `error`);
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