JARVIS — Study Companion & Focus Analytics HUD (Eyes-Only Notch Edition)

WHAT THIS DOES
1. Docks an ultra-clean, minimalist hardware notch (92x24px) flush to the top bezel of your primary monitor.
2. Zero Distraction Notch:
   - Contains ONLY the serene companion eyes.
   - No timers, text, buttons, or progress bars on the notch.
3. Pomodoro Session Indications on Notch:
   - Focus Mode: Serene, steady electric cyan eyes with calm downward gaze while studying.
   - Break Time Alert (e.g. 25m focus finishes -> 5m break starts):
     - Eyes morph into soothing Emerald Green curved eyes (^‿^).
     - Plays a gentle 3-tone celebration chime.
     - Notch border pulses softly with an emerald break aura.
   - Break Finished Alert (5m break ends -> ready for next 25m round):
     - Plays a power-up focus chime and transitions eyes back to Electric Cyan focus mode.
4. Calm & Natural Eye Behavior:
   - Distraction-Free Blinking: Soft, calm blinks every 45 seconds.
   - Sleep Mode: Restful eye slits (- -) during long idle periods, waking up gently on mouse movement.
   - Friendly Wink: Clicking the eyes triggers a playful wink and opens the Full Study HUD.
5. High-Precision Study HUD & Focus Analytics:
   - Millisecond-precise timestamp delta timers (never lags or slows down in background).
   - Pomodoro cycles: 25/5, 50/10, 60/10, or custom focus/break minutes.
   - Task manager, syllabus tracker, and daily streak tracking.
6. 24-Hour Time-of-Day Focus Distribution Charts:
   - Interactive Canvas chart breaking down focus minutes across all 24 hours of the day (00:00 - 23:00).
   - Golden peak hour and low-focus slump hour markers.
   - Day-by-Day Focus Volume & Target Goal line charts.
   - Weekly 7x24 Focus Intensity Matrix Heatmap.
   - Time quadrant progress metrics (Morning, Afternoon, Evening, Night).
7. AI Focus Diagnostics & Targeted Improvement Coach:
   - Identifies exact time-slots where focus is lacking (focus slumps & dead zones).
   - Provides concrete, actionable fixes (e.g. 15-min micro-sprints, hydration breaks, active recall).
   - Identifies golden peak productivity windows to protect for high-difficulty missions.
   - Real-time upcoming session recommendations.
8. Persistent File Handling Path & Storage Manager:
   - Saves all focus data and session logs to a structured local JSON file.
   - Live file path display with one-click copy.
   - "Open Folder in Explorer" and "Open Data File" buttons.
   - Full Data Export (JSON / CSV for Excel) and Import/Restore capabilities.

RUN FROM CMD
1. Open CMD.
2. cd into this folder.
3. Run:
   npm install
   npm start

OR double-click:
   run.cmd

REQUIREMENTS
- Node.js LTS + npm
- Windows 10/11

FILES
- main.js          Electron main process with file persistence & IPC state sync
- preload.js       Safe context bridge for notch, dashboard, and file storage
- companion.html   Minimalist eyes-only notch UI with Pomodoro indications
- productivity.html Full study dashboard with 24-hr charts, AI diagnostics & file manager
- package.json     Electron configuration
- run.cmd          One-click launcher

