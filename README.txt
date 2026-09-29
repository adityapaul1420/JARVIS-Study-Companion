JARVIS — Study Companion (Eyes-Only Notch Edition)

WHAT THIS DOES
1. Docks an ultra-clean, minimalist hardware notch (92x24px) flush to the top bezel of your primary monitor.
2. Zero Distraction:
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
5. High-Precision Study HUD:
   - Millisecond-precise timestamp delta timers (never lags or slows down in background).
   - Pomodoro cycles: 25/5, 50/10, 60/10, or custom focus/break minutes.
   - Task manager, focus analytics, and daily streak tracker.

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
- main.js          Electron main process with notch positioning & IPC state sync
- preload.js       Safe context bridge between notch and dashboard
- companion.html   Minimalist eyes-only notch UI with Pomodoro indications
- productivity.html Full study dashboard with Pomodoro cycles, tasks, and analytics
- package.json     Electron configuration
- run.cmd          One-click launcher
