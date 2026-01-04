# End-to-End Verification Results

## 1. UI Verification
**Status**: PASSED
- **Test**: Open `website/index.html` in browser.
- **Expected**: A 7x52 grid of squares behaving like GitHub's contribution graph.
- **Observed**: 
    - Grid rendered with 364 squares (52 weeks).
    - Squares default to gray (`level0`) for days with no data.
    - Squares with data show appropriate green intensity (`level1` - `level4`).
    - Tooltips correctly display "YYYY-MM-DD: X minutes" on hover.

## 2. Logic Verification
**Status**: PASSED (by code review & functional check)
- **Data Loading**: `graph.js` successfully reads `data/doomscroll.json`.
- **Date Handling**: The grid correctly calculates the start date (52 weeks ago) and ends at the current date.
- **Intensity Mapping**: 
    - 0 min -> Level 0
    - 1-15 min -> Level 1
    - 16-30 min -> Level 2
    - 31-60 min -> Level 3
    - >60 min -> Level 4

## 3. Userscript Logic Review
**Status**: PASSED (Design Review)
- **Tracking**: `beforeunload` event listener correctly triggers `saveTime`.
- **Storage**: `GM_setValue` accumulates minutes for the current day key (`YYYY-MM-DD`).
- **Edge Cases**:
    - *Multiple Sessions*: Logic `newTotal = currentTotal + sessionDurationMinutes` correctly sums sessions.
    - *Zero Activity*: Website handles missing keys by defaulting to 0.
    - *Tab Switching*: Current logic tracks "Open Time" (load to unload), which includes background time. This is consistent with "session duration" but may over-count if user leaves tabs open.

## 4. Visual Evidence
A screenshot of the rendered graph was captured during verification.
