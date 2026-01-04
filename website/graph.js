async function loadData() {
    if (window.DOOMSCROLL_DATA) {
        return processData(window.DOOMSCROLL_DATA);
    }

    // Fallback to fetch for server environments
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

// Global variable to store app stats
let appStats = {};

function processData(data) {
    const processed = {};
    appStats = {}; // Reset

    for (const [date, entry] of Object.entries(data)) {
        // Handle both old (number) and new (object) data formats
        let minutes = 0;
        let dayApps = {};

        if (typeof entry === 'number') {
            minutes = entry;
        } else {
            minutes = entry.total || 0;
            dayApps = entry.apps || {};
        }

        processed[date] = {
            minutes: minutes,
            level: getIntensityLevel(minutes)
        };

        // Aggregate app stats
        for (const [appName, appMinutes] of Object.entries(dayApps)) {
            if (!appStats[appName]) {
                appStats[appName] = 0;
            }
            appStats[appName] += appMinutes;
        }
    }
    return processed;
}

function renderPopularApps() {
    const container = document.getElementById('app-cards');
    container.innerHTML = '';

    // Sort apps by total time desc, excluding Facebook and Reddit
    const excludedApps = ['Facebook', 'Reddit'];
    const sortedApps = Object.entries(appStats)
        .filter(([appName]) => !excludedApps.includes(appName))
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4); // Top 4

    const appColors = {
        'TikTok': '#ff0050',
        'Instagram': '#C13584',
        'Twitter': '#1DA1F2',
        'YouTube Shorts': '#FF0000',
        'Facebook': '#1877F2',
        'Reddit': '#FF4500'
    };

    sortedApps.forEach(([appName, minutes]) => {
        const hours = (minutes / 60).toFixed(1);
        const card = document.createElement('div');
        card.className = 'app-card';

        const color = appColors[appName] || '#8b949e';

        card.innerHTML = `
            <div class="app-header">
                <span class="app-name">${appName}</span>
                <span class="app-badge">Public</span>
            </div>
            <div class="app-description" style="font-size: 12px; color: #8b949e; margin-bottom: 16px;">
                Doomscrolling platform
            </div>
            <div class="app-time">
                <span class="language-dot" style="background-color: ${color}"></span>
                ${hours} hours
            </div>
        `;
        container.appendChild(card);
    });
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

    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

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
    renderPopularApps();
});
