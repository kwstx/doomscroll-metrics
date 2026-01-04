// ==UserScript==
// @name         Doomscroll Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
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
        const currentTotal = GM_getValue(dateKey, 0);
        const newTotal = currentTotal + sessionDurationMinutes;

        GM_setValue(dateKey, newTotal);

        console.log(`[Doomscroll Tracker] Saved ${sessionDurationMinutes.toFixed(2)} minutes. Daily total: ${newTotal.toFixed(2)} minutes.`);
    }

    // Measure time when the window is closed or navigated away
    window.addEventListener('beforeunload', saveTime);

})();
