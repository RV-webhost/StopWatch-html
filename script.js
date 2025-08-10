let startTime;
let intervalId;
let elapsedTime = 0;
let running = false;
let lapTimes = [];

const display = document.getElementById("display");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const lapsList = document.getElementById("laps");
const container = document.querySelector(".container");

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
        formatted: `${String(hours).padStart(2, '0')}:` +
                    `${String(minutes).padStart(2, '0')}:` +
                    `${String(seconds).padStart(2, '0')}.` +
                    `${String(milliseconds).padStart(2, '0')}`,
        raw: ms
    };
}

function updateDisplay() {
    const currentTime = Date.now() - startTime + elapsedTime;
    display.textContent = formatTime(currentTime).formatted;
}

function updateButtonStates() {
    lapBtn.disabled = !running;
    resetBtn.disabled = running || (elapsedTime === 0 && lapsList.children.length === 0);
}

function highlightExtremeLaps() {
    if (lapTimes.length < 2) return;

    const laps = lapsList.children;
    const fastestIndex = lapTimes.indexOf(Math.min(...lapTimes));
    const slowestIndex = lapTimes.indexOf(Math.max(...lapTimes));

    for (let i = 0; i < laps.length; i++) {
        laps[i].className = '';
        if (i === fastestIndex) laps[i].classList.add('fastest');
        if (i === slowestIndex) laps[i].classList.add('slowest');
    }
}

startStopBtn.addEventListener("click", () => {
    if (!running) {
        startTime = Date.now();
        intervalId = setInterval(updateDisplay, 10);
        startStopBtn.textContent = "Stop";
        running = true;
        container.classList.add("running");
    } else {
        clearInterval(intervalId);
        elapsedTime += Date.now() - startTime;
        startStopBtn.textContent = "Start";
        running = false;
        container.classList.remove("running");
    }
    updateButtonStates();
});

resetBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    elapsedTime = 0;
    running = false;
    lapTimes = [];
    display.textContent = "00:00:00.00";
    startStopBtn.textContent = "Start";
    lapsList.innerHTML = "";
    container.classList.remove("running");
    updateButtonStates();
});

lapBtn.addEventListener("click", () => {
    if (running) {
        const currentTime = Date.now() - startTime + elapsedTime;
        const formattedTime = formatTime(currentTime);
        lapTimes.push(formattedTime.raw);

        const lapItem = document.createElement("li");
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapsList.children.length + 1}</span>
            <span class="lap-time">${formattedTime.formatted}</span>
        `;
        lapsList.prepend(lapItem);
        highlightExtremeLaps();
        
        // Add visual feedback
        lapItem.style.transform = "scale(1.1)";
        setTimeout(() => {
            lapItem.style.transform = "";
        }, 200);
    }
});

// Initialize button states
updateButtonStates();