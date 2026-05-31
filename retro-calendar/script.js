const datePlate = document.getElementById('date-plate');
const slider    = document.getElementById('slider');
const sliderGlass = document.getElementById('slider-glass');
const cutoutGrid  = document.getElementById('cutout-grid');
const monthDisplay = document.getElementById('month-display');
const monthWheel   = document.getElementById('month-wheel');

const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
let currentYear     = new Date().getFullYear();
let currentMonthIdx = new Date().getMonth();

// ── 1. Generate cutout-grid holes ─────────────────────────────────────────────
for (let i = 0; i < 35; i++) {
    const hole = document.createElement('div');
    hole.className = 'hole';
    cutoutGrid.appendChild(hole);
}

// ── 2. SVG Mask on the glass frame ───────────────────────────────────────────
// The mask punches 35 clean rectangular windows through the frosted glass,
// leaving the numbers underneath fully unobscured.
function generateMask() {
    const W = 336, H = 246;
    // Row y starts at 40px (header height ~32px + 8px margin) with gap-y 8px
    let d = `M0,0 h${W} v${H} h-${W} Z`;
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 7; c++) {
            const x = 10 + c * 46;  // 10px padding-left, 46px step (38+8)
            const y = 40 + r * 40;  // 40px header zone, 40px row step (32+8)
            d += ` M${x},${y} h38 v32 h-38 Z`;
        }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
                `<path d="${d}" fill="black" fill-rule="evenodd"/></svg>`;
    const uri = `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
    sliderGlass.style.webkitMaskImage = uri;
    sliderGlass.style.maskImage = uri;
}
generateMask();

// ── 3. Perpetual 13-column number plate ──────────────────────────────────────
const plateMatrix = [
    "•","•","•","•","•","•","•","1","2","3","4","5","6",
    "1","2","3","4","5","6","7","8","9","10","11","12","13",
    "8","9","10","11","12","13","14","15","16","17","18","19","20",
    "15","16","17","18","19","20","21","22","23","24","25","26","27",
    "22/29","23/30","24/31","25","26","27","28","29","30","31","•","•","•"
];

const dateNodes = [];
plateMatrix.forEach((val, idx) => {
    const div = document.createElement('div');
    div.className = val === "•" ? "date-num dot" : "date-num";
    div.textContent = val;
    datePlate.appendChild(div);
    dateNodes.push(div);
});

// ── 4. Highlight numbers that sit under the slider window ────────────────────
// colStart = which plate column (0-12) is currently under the slider's
// left edge.  The slider shows columns colStart … colStart+6.
function highlightVisibleNumbers(colStart) {
    const COLS = 13;
    const ROWS = 5;
    dateNodes.forEach((node, idx) => {
        const row = Math.floor(idx / COLS);
        const col = idx % COLS;
        const isVisible = col >= colStart && col < colStart + 7;
        node.classList.toggle('visible', isVisible && !node.classList.contains('dot'));
        // Mark the Sunday (leftmost visible) column for red colouring
        node.classList.toggle('sunday', isVisible && col === colStart && !node.classList.contains('dot'));
    });
}

// ── 5. Physics: drag + snap ───────────────────────────────────────────────────
let isDragging = false;
let startX = 0;
let currentXOffset = 0;

const stepSize = 46;  // cell-w (38) + gap-x (8)
const minX = 0;
const maxX = 6 * stepSize;   // 276px

function setSliderTransform(x, animate = false) {
    if (animate) {
        slider.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1.15)';
    } else {
        slider.style.transition = 'none';
    }
    slider.style.transform = `translateX(${x}px)`;

    // Derive which plate column is at the left edge of the slider.
    // slider left-edge sits at CSS left:14px; plate grid starts at left:25px.
    // Plate column 0 left-edge is at 25px absolute.
    // Slider window left-content starts at 25px (14 + 10 padding + 1 border).
    // So when translateX = N*stepSize, the left visible col = N.
    const colStart = Math.round(x / stepSize);
    highlightVisibleNumbers(colStart);
}

slider.addEventListener('mousedown', dragStart);
window.addEventListener('mousemove', dragMove);
window.addEventListener('mouseup', dragEnd);
slider.addEventListener('touchstart', dragStart, { passive: true });
window.addEventListener('touchmove', dragMove, { passive: false });
window.addEventListener('touchend', dragEnd);

function dragStart(e) {
    isDragging = true;
    slider.style.transition = 'none';
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startX = clientX - currentXOffset;
}

function dragMove(e) {
    if (!isDragging) return;
    if (e.type === 'touchmove') e.preventDefault();
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let newX = Math.min(maxX, Math.max(minX, clientX - startX));
    currentXOffset = newX;
    setSliderTransform(currentXOffset, false);
}

function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    let col = Math.round(currentXOffset / stepSize);
    col = Math.min(6, Math.max(0, col));
    currentXOffset = col * stepSize;
    slider.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    slider.style.transform = `translateX(${currentXOffset}px)`;
    highlightVisibleNumbers(col);
}

// ── 6. Month wheel ────────────────────────────────────────────────────────────
function updateCalendarForMonth(monthIdx, animate = true) {
    currentMonthIdx = monthIdx;
    monthDisplay.textContent = months[currentMonthIdx];

    const startDay  = new Date(currentYear, currentMonthIdx, 1).getDay();
    const colIndex  = startDay === 0 ? 0 : 7 - startDay;
    currentXOffset  = colIndex * stepSize;
    setSliderTransform(currentXOffset, animate);
}

let wheelStartY = 0;
monthWheel.addEventListener('mousedown', (e) => {
    wheelStartY = e.clientY;
    window.addEventListener('mousemove', rotateWheel);
    window.addEventListener('mouseup', stopRotateWheel);
});
function stopRotateWheel() {
    window.removeEventListener('mousemove', rotateWheel);
    window.removeEventListener('mouseup', stopRotateWheel);
}
function rotateWheel(e) {
    const delta = e.clientY - wheelStartY;
    if (Math.abs(delta) > 12) {
        currentMonthIdx = (currentMonthIdx + (delta > 0 ? 1 : -1) + 12) % 12;
        updateCalendarForMonth(currentMonthIdx, true);
        wheelStartY = e.clientY;
    }
}
monthWheel.addEventListener('wheel', (e) => {
    e.preventDefault();
    currentMonthIdx = (currentMonthIdx + (e.deltaY > 0 ? 1 : -1) + 12) % 12;
    updateCalendarForMonth(currentMonthIdx, true);
}, { passive: false });

// ── 7. Boot ───────────────────────────────────────────────────────────────────
updateCalendarForMonth(currentMonthIdx, false);