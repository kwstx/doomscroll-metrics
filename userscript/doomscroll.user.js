// ==UserScript==
// @name         Doomscroll Tracker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Track time spent on doomscrolling sites
// @author       You
// @match        *://www.tiktok.com/*
// @match        *://www.instagram.com/*
// @match        *://twitter.com/*
// @match        *://x.com/*
// @match        *://www.youtube.com/shorts/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';

    const START_TIME = Date.now();

    // Determine current app based on hostname
    function getCurrentApp() {
        const host = window.location.hostname;
        if (host.includes('tiktok')) return 'TikTok';
        if (host.includes('instagram')) return 'Instagram';
        if (host.includes('twitter') || host.includes('x.com')) return 'Twitter';
        if (host.includes('youtube')) return 'YouTube Shorts';
        return 'Unknown';
    }

    const APP_NAME = getCurrentApp();

    // Helper to get today's date key (YYYY-MM-DD)
    function getDateKey() {
        return new Date().toISOString().split('T')[0];
    }

    function saveTime() {
        const endTime = Date.now();
        const sessionDurationMs = endTime - START_TIME;
        const sessionDurationMinutes = sessionDurationMs / 1000 / 60; // Convert to minutes

        if (sessionDurationMinutes <= 0) return;

        const dateKey = getDateKey();

        // Load existing data for the day
        // Structure: { total: number, apps: { "AppName": number } }
        let dayData = GM_getValue(dateKey, { total: 0, apps: {} });

        // Handle migration from old format where it might just be a number
        if (typeof dayData === 'number') {
            dayData = { total: dayData, apps: {} };
        }

        // Update totals
        dayData.total += sessionDurationMinutes;

        if (!dayData.apps[APP_NAME]) {
            dayData.apps[APP_NAME] = 0;
        }
        dayData.apps[APP_NAME] += sessionDurationMinutes;

        GM_setValue(dateKey, dayData);

        console.log(`[Doomscroll Tracker] Saved ${sessionDurationMinutes.toFixed(2)} minutes for ${APP_NAME}. Daily total: ${dayData.total.toFixed(2)} minutes.`);
    }

    // Measure time when the window is closed or navigated away
    window.addEventListener('beforeunload', saveTime);

})();
