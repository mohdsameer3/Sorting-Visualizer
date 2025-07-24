const arrayDiv = document.querySelector('.result');
const speedSlider = document.querySelector("#speed");
const arraySizeInput = document.querySelector("#arraySize");
const bestCaseComplexitySpan = document.getElementById("bestCaseComplexity");
const averageCaseComplexitySpan = document.getElementById("averageCaseComplexity");
const worstCaseComplexitySpan = document.getElementById("worstCaseComplexity");
const spaceComplexitySpan = document.getElementById("spaceComplexity");

let isSorting = false;
let currentArray = [];

const delay = (ms) => {
    return new Promise(resolve => {
        if (!isSorting) {
            resolve();
            return;
        }
        setTimeout(resolve, ms);
    });
};

const showToast = (msg, bgColor = "#ffcc00", textColor = "#000") => {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: msg,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: bgColor,
            style: {
                color: textColor,
                borderRadius: "5px",
                fontWeight: "bold"
            },
            stopOnFocus: true
        }).showToast();
    } else {
        console.warn("Toastify library not found. Cannot show toast:", msg);
    }
};

const generateArray = () => {
    arrayDiv.innerHTML = "";
    isSorting = false;
    currentArray = [];

    const arrayLength = parseInt(arraySizeInput.value);
    const maxBarHeight = 90;
    const minBarHeight = 10;

    const maxAllowedWidth = 20;
    const minAllowedWidth = 4;
    const barMargin = 1.5;

    const containerWidth = arrayDiv.offsetWidth;
    const totalMarginWidth = arrayLength * (barMargin * 2);
    const availableWidthForBars = containerWidth - totalMarginWidth;
    let barWidth = Math.floor(availableWidthForBars / arrayLength);
    barWidth = Math.max(minAllowedWidth, Math.min(maxAllowedWidth, barWidth));

    for (let i = 0; i < arrayLength; i++) {
        const height = Math.floor(Math.random() * (maxBarHeight - minBarHeight + 1)) + minBarHeight;
        const bar = document.createElement("div");
        bar.classList.add("array-bar");
        bar.style.height = `${height}%`;
        bar.style.width = `${barWidth}px`;
        bar.style.margin = `0 ${barMargin}px`;
        bar.style.display = "inline-block";
        bar.style.backgroundColor = "white";
        bar.style.borderRadius = "3px";

        arrayDiv.appendChild(bar);
        currentArray.push(height);
    }

    updateComplexityCard("N/A", "N/A", "N/A", "N/A");
};

const updateComplexityCard = (best, average, worst, space) => {
    bestCaseComplexitySpan.textContent = best;
    averageCaseComplexitySpan.textContent = average;
    worstCaseComplexitySpan.textContent = worst;
    spaceComplexitySpan.textContent = space;
};

const stopSorting = () => {
    // Only show "Sorting Stopped!" toast if a sort was actually in progress
    if (isSorting) {
        showToast("Sorting Stopped!", "#dc3545", "white");
    }
    isSorting = false;
    document.querySelectorAll('.array-bar').forEach(bar => bar.style.backgroundColor = "white");
};

const resetArray = () => {
    stopSorting();
    generateArray();
};

//bubble sort
const BubbleSort = async () => {
    if (isSorting) {
        return;
    }
    isSorting = true;
    updateComplexityCard("O(N)", "O(N^2)", "O(N^2)", "O(1)");

    const bars = document.querySelectorAll('.array-bar');
    const n = bars.length;
    const delayValue = parseInt(speedSlider.value);

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (!isSorting) {
                // If stopped during the loop, revert current comparison colors
                bars[j].style.backgroundColor = "white";
                bars[j + 1].style.backgroundColor = "white";
                return;
            }

            bars[j].style.backgroundColor = "#6EEB83";
            bars[j + 1].style.backgroundColor = "#00FFFF";

            await delay(delayValue);
            if (!isSorting) {
                bars[j].style.backgroundColor = "white";
                bars[j + 1].style.backgroundColor = "white";
                return;
            }

            const height1 = parseInt(bars[j].style.height);
            const height2 = parseInt(bars[j + 1].style.height);

            if (height1 > height2) {
                [bars[j].style.height, bars[j + 1].style.height] =
                    [bars[j + 1].style.height, bars[j].style.height];
            }

            bars[j].style.backgroundColor = "white";
            bars[j + 1].style.backgroundColor = "white";
        }
        bars[n - 1 - i].style.backgroundColor = "#a78bfa";
        if (!isSorting) { return; }
    }
    bars[0].style.backgroundColor = "#a78bfa";

    if (isSorting) {
        bars.forEach(bar => bar.style.backgroundColor = "#a78bfa");
        showToast("Bubble Sort Completed!", "#36cc5aff", "white");
    }
    isSorting = false;
};

//selection sort
const SelectionSort = async () => {
    if (isSorting) {
        return;
    }
    isSorting = true;
    updateComplexityCard("O(N^2)", "O(N^2)", "O(N^2)", "O(1)");

    const bars = document.querySelectorAll('.array-bar');
    const n = bars.length;
    const delayValue = parseInt(speedSlider.value);

    for (let i = 0; i < n - 1; i++) {
        if (!isSorting) {
            return;
        }

        let minIdx = i;
        bars[i].style.backgroundColor = "#FF7F50";

        for (let j = i + 1; j < n; j++) {
            if (!isSorting) {
                bars[minIdx].style.backgroundColor = "white";
                bars[j].style.backgroundColor = "white";
                return;
            }

            bars[j].style.backgroundColor = "#00FFFF";
            await delay(delayValue);
            if (!isSorting) {
                bars[minIdx].style.backgroundColor = "white";
                bars[j].style.backgroundColor = "white";
                return;
            }

            if (parseInt(bars[j].style.height) < parseInt(bars[minIdx].style.height)) {
                if (minIdx !== i) {
                    bars[minIdx].style.backgroundColor = "white";
                }
                minIdx = j;
                bars[minIdx].style.backgroundColor = "#6EEB83";
            } else {
                if (j !== i) {
                    bars[j].style.backgroundColor = "white";
                }
            }
        }

        await delay(delayValue);
        if (!isSorting) {
            bars[i].style.backgroundColor = "white";
            if (minIdx !== i) bars[minIdx].style.backgroundColor = "white";
            return;
        }

        if (minIdx !== i) {
            [bars[i].style.height, bars[minIdx].style.height] =
                [bars[minIdx].style.height, bars[i].style.height];
        }

        bars[i].style.backgroundColor = "#a78bfa";
        if (minIdx !== i) bars[minIdx].style.backgroundColor = "white";

        if (!isSorting) { return; }
    }
    bars[n - 1].style.backgroundColor = "#a78bfa";

    if (isSorting) {
        bars.forEach(bar => bar.style.backgroundColor = "#a78bfa");
        showToast("Selection Sort Completed!", "#36cc5aff", "white");
    }
    isSorting = false;
};

//insertion sort
const InsertionSort = async () => {
    if (isSorting) {
        return;
    }
    isSorting = true;
    updateComplexityCard("O(N)", "O(N^2)", "O(N^2)", "O(1)");

    const bars = document.querySelectorAll('.array-bar');
    const n = bars.length;
    const delayValue = parseInt(speedSlider.value);

    for (let i = 1; i < n; i++) {
        if (!isSorting) {
            return;
        }

        let currentHeight = parseInt(bars[i].style.height);
        let j = i - 1;

        bars[i].style.backgroundColor = "#FF7F50";
        await delay(delayValue);
        if (!isSorting) {
            bars[i].style.backgroundColor = "white";
            return;
        }

        while (j >= 0 && parseInt(bars[j].style.height) > currentHeight) {
            if (!isSorting) {
                bars[j].style.backgroundColor = "white";
                bars[j + 1].style.backgroundColor = "white";
                return;
            }

            bars[j].style.backgroundColor = "#00FFFF";
            await delay(delayValue);
            if (!isSorting) {
                bars[j].style.backgroundColor = "white";
                bars[j + 1].style.backgroundColor = "white";
                return;
            }

            bars[j + 1].style.height = bars[j].style.height;
            bars[j].style.backgroundColor = "white";
            j--;
        }
        bars[j + 1].style.height = `${currentHeight}%`;

        bars[i].style.backgroundColor = "white";
        for (let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = "#a78bfa";
        }
        await delay(delayValue);
        if (!isSorting) { return; }
    }

    if (isSorting) {
        bars.forEach(bar => bar.style.backgroundColor = "#a78bfa");
        showToast("Insertion Sort Completed!", "#36cc5aff", "white");
    }
    isSorting = false;
};

//merge sort
const merge = async (bars, low, mid, high) => {
    const delayValue = parseInt(speedSlider.value);
    const n1 = mid - low + 1;
    const n2 = high - mid;

    let leftArray = new Array(n1);
    let rightArray = new Array(n2);

    for (let i = 0; i < n1; i++) {
        if (!isSorting) { return; }
        bars[low + i].style.backgroundColor = "#FFD700";
        leftArray[i] = parseInt(bars[low + i].style.height);
        await delay(delayValue);
        if (!isSorting) { return; }
    }
    for (let j = 0; j < n2; j++) {
        if (!isSorting) { return; }
        bars[mid + 1 + j].style.backgroundColor = "#6EEB83";
        rightArray[j] = parseInt(bars[mid + 1 + j].style.height);
        await delay(delayValue);
        if (!isSorting) { return; }
    }

    let i = 0;
    let j = 0;
    let k = low;

    while (i < n1 && j < n2) {
        if (!isSorting) { return; }

        bars[low + i].style.backgroundColor = "#00FFFF";
        bars[mid + 1 + j].style.backgroundColor = "#00FFFF";
        await delay(delayValue);
        if (!isSorting) {
            bars[low + i].style.backgroundColor = "white";
            bars[mid + 1 + j].style.backgroundColor = "white";
            return;
        }

        if (leftArray[i] <= rightArray[j]) {
            bars[k].style.height = `${leftArray[i]}%`;
            i++;
        } else {
            bars[k].style.height = `${rightArray[j]}%`;
            j++;
        }
        bars[k].style.backgroundColor = "#a78bfa";
        k++;
        await delay(delayValue);
        if (!isSorting) { return; }
    }

    while (i < n1) {
        if (!isSorting) { return; }
        bars[k].style.height = `${leftArray[i]}%`;
        bars[k].style.backgroundColor = "#a78bfa";
        i++;
        k++;
        await delay(delayValue);
        if (!isSorting) { return; }
    }

    while (j < n2) {
        if (!isSorting) { return; }
        bars[k].style.height = `${rightArray[j]}%`;
        bars[k].style.backgroundColor = "#a78bfa";
        j++;
        k++;
        await delay(delayValue);
        if (!isSorting) { return; }
    }

    for (let x = low; x <= high; x++) {
        if (!isSorting) { return; }
        bars[x].style.backgroundColor = "#a78bfa";
    }
};

const mergeSortRecursive = async (bars, low, high) => {
    if (!isSorting) { return; }
    if (low >= high) {
        if (low === high) {
            bars[low].style.backgroundColor = "#a78bfa";
            await delay(parseInt(speedSlider.value));
            if (!isSorting) { return; }
        }
        return;
    }

    const mid = low + Math.floor((high - low) / 2);

    for (let i = low; i <= high; i++) {
        if (!isSorting) { return; }
        if (bars[i].style.backgroundColor !== "rgb(167, 139, 250)") {
            bars[i].style.backgroundColor = "#FF7F50";
        }
    }
    await delay(parseInt(speedSlider.value));
    if (!isSorting) {
        for (let i = low; i <= high; i++) {
            if (bars[i].style.backgroundColor === "rgb(255, 127, 80)") {
                bars[i].style.backgroundColor = "white";
            }
        }
        return;
    }

    await mergeSortRecursive(bars, low, mid);
    if (!isSorting) { return; }

    await mergeSortRecursive(bars, mid + 1, high);
    if (!isSorting) { return; }

    await merge(bars, low, mid, high);
    if (!isSorting) { return; }
};

const MergeSort = async () => {
    if (isSorting) {
        return;
    }
    isSorting = true;
    updateComplexityCard("O(N log N)", "O(N log N)", "O(N log N)", "O(N)");

    const bars = document.querySelectorAll('.array-bar');
    const n = bars.length;

    await mergeSortRecursive(bars, 0, n - 1);

    if (isSorting) {
        for (let k = 0; k < n; k++) {
            bars[k].style.backgroundColor = "#a78bfa";
        }
        showToast("Merge Sort Completed!", "#36cc5aff", "white");
    }
    isSorting = false;
};

document.addEventListener("DOMContentLoaded", () => {
    generateArray();
    updateComplexityCard("N/A", "N/A", "N/A", "N/A");
});

arraySizeInput.addEventListener("change", generateArray);
arraySizeInput.addEventListener("input", generateArray);