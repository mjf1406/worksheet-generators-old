let lastToastTimes = { success: 0, error: 0, warning: 0, info: 0 };
var toastDebounceDelay = 3000; // Adjust as needed
var toastDebounceTimers = {
    success: null,
    error: null,
    warning: null,
    info: null,
};

function makeToast(content, type) {
    const now = Date.now();

    // Check if it's the first toast of its type or enough time has passed since the last toast of the same type
    if (
        now - lastToastTimes[type] > toastDebounceDelay ||
        lastToastTimes[type] === 0
    ) {
        lastToastTimes[type] = now; // Update the last toast time for the type
        showToast(content, type); // Show the toast immediately
    } else {
        // If the toast of the same type is triggered too soon, delay it
        if (toastDebounceTimers[type]) clearTimeout(toastDebounceTimers[type]);
        toastDebounceTimers[type] = setTimeout(() => {
            lastToastTimes[type] = Date.now(); // Update the last toast time for the type
            showToast(content, type);
        }, toastDebounceDelay - (now - lastToastTimes[type]));
    }
}

function showToast(content, type) {
    let backgroundColor;
    if (type === "success") backgroundColor = "#166534";
    else if (type === "warning") backgroundColor = "#fde047";
    else if (type === "error") backgroundColor = "#b91c1c";
    else if (type === "info") backgroundColor = "#40E0D0";

    let color;
    if (type === "success") color = "#fff";
    else if (type === "warning") color = "#000";
    else if (type === "error") color = "#fff";
    else if (type === "info") color = "#000";

    Toastify({
        text: content,
        offset: {
            x: 10,
            y: 10,
        },
        gravity: "bottom",
        position: "left",
        style: {
            background: backgroundColor,
            color: color,
            zIndex: 1000,
        },
        escapeMarkup: false,
    }).showToast();
}
