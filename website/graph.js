async function loadData() {
    try {
        const response = await fetch('../data/doomscroll.json');
        const data = await response.json();
        return processData(data);
    } catch (error) {
        console.error('Error loading data:', error);
        return {};
    }
}

function getIntensityLevel(minutes) {
    if (minutes === 0) return 0;
    if (minutes <= 15) return 1;
    if (minutes <= 30) return 2;
    if (minutes <= 60) return 3;
    return 4;
}

function processData(data) {
    const processed = {};
    for (const [date, minutes] of Object.entries(data)) {
        processed[date] = {
            minutes: minutes,
            level: getIntensityLevel(minutes)
        };
    }
    return processed;
}

function renderGraph(data) {
    const graphContainer = document.getElementById('graph');
    graphContainer.innerHTML = ''; // Clear existing

    // Calculate start date: 52 weeks ago from today, aligned to the previous Sunday
    const today = new Date();
    const endDate = new Date(today);

    // 52 weeks * 7 days = 364 days
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 364);

    // Adjust to previous Sunday to ensure grid starts at top row
    // Day of week: 0 (Sun) to 6 (Sat)
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    // Generate 365 days (52 weeks + 1 day to include end date effectively or just fill 52x7)
    // Actually standard 7x52 is 364 days. Let's do 53 weeks to cover partials if needed, 
    // or just strict 7x52 from the adjusted Sunday.
    const totalDays = 52 * 7;

    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const dateKey = currentDate.toISOString().split('T')[0];
        const dayData = data[dateKey];

        const level = dayData ? dayData.level : 0;
        const minutes = dayData ? dayData.minutes : 0;

        const dayEl = document.createElement('div');
        dayEl.classList.add('day');
        dayEl.classList.add(`level${level}`);

        // Add tooltip
        dayEl.title = `${dateKey}: ${minutes} minutes`;

        graphContainer.appendChild(dayEl);
    }
}

// Auto-load and render
loadData().then(data => {
    console.log('Processed Data:', data);
    renderGraph(data);
});
