/**
 * Redtail Land Surveying — Realistic Flying Hawk Chat Widget
 * 
 * Features:
 *  - Autonomous JS flight simulation (steering behaviors) around the viewport
 *  - Fixed "perch" (chat bubble) in the bottom right corner
 *  - Clicking the bird OR the perch triggers the hawk to fly to the perch and land, opening chat
 *  - Detailed SVG redtail hawk with CSS-animated wing flaps
 */

(function () {
  const config = window.AgentConfig || {};
  const API_URL = (config.apiUrl || (
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "http://localhost:8000"
      : ""  // relative URL on production (same origin)
  )).replace(/\/$/, "");
  const AGENT_NAME = config.agentName || "redtail";
  const TITLE = config.title || "Ask Redtail";
  const ACCENT = config.accent || "#E8630A";
  const USER_AVATAR = config.userAvatar || "👤";

  // ── Inject global styles ───────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    /* ── PERCH (Bubble) ── */
    #sa-bubble {
      position: fixed; bottom: 28px; right: 28px; z-index: 99990;
      width: 72px; height: 72px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #2D5016, #1B3009);
      box-shadow:
        0 0 0 3px rgba(232,99,10,0.4),
        0 8px 32px rgba(0,0,0,0.5);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      border: none; outline: none;
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
    }
    #sa-bubble:hover { transform: scale(1.05) translateY(-2px); }
    #sa-bubble.open  { box-shadow: 0 0 0 3px rgba(232,99,10,0.5), 0 8px 32px rgba(0,0,0,0.5); transform: translateY(0); cursor: default; }

    /* Empty perch state (when flying) */
    .sa-perch-icon {
      font-size: 28px;
      opacity: 0.6;
      transition: opacity 0.3s;
    }
    #sa-bubble.open .sa-perch-icon { display: none; }
    
    /* Close icon behind perched bird */
    #sa-bubble .sa-close-icon {
      display: none; position: absolute;
      width: 100%; height: 100%; border-radius: 50%;
      background: rgba(27,48,9,0.9);
      align-items: center; justify-content: center;
      font-size: 24px; color: #fff; font-style: normal;
      backdrop-filter: blur(4px);
      z-index: 10; cursor: pointer;
    }
    #sa-bubble.open:hover .sa-close-icon { display: flex; }

    /* ── FLYING HAWK ── */
    #sa-hawk-container {
      position: fixed; 
      top: 0; left: 0; /* Anchor to top left, translate handles position */
      width: 80px; height: 80px; 
      /* Offset by half width/height so translate(x,y) positions the CENTER */
      margin-left: -40px; margin-top: -40px;
      z-index: 99995; 
      pointer-events: auto; cursor: pointer;
      filter: drop-shadow(0px 15px 10px rgba(0,0,0,0.4));
      /* We explicitly DO NOT transition transform in CSS because JS is updating it every frame */
      transition: filter 0.3s ease;
    }
    #sa-hawk-container.perched {
      filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5));
      pointer-events: none; /* Let the bubble handle clicks when perched */
    }

    /* Wing Flapping */
    @keyframes sa-flap-top {
      0%, 100% { transform: scaleY(1); }
      50%      { transform: scaleY(0.7); }
    }
    @keyframes sa-flap-bottom {
      0%, 100% { transform: scaleY(1); }
      50%      { transform: scaleY(0.7); }
    }
    
    .sa-wing-top { transform-origin: 50% 45%; }
    .sa-wing-bottom { transform-origin: 50% 55%; }
    
    #sa-hawk-container.flapping .sa-wing-top { animation: sa-flap-top 1.2s ease-in-out infinite; }
    #sa-hawk-container.flapping .sa-wing-bottom { animation: sa-flap-bottom 1.2s ease-in-out infinite; }

    /* Hovering over flying bird */
    #sa-hawk-tooltip {
      position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 6px;
      font-size: 12px; font-weight: 500; pointer-events: none; opacity: 0;
      white-space: nowrap; transition: opacity 0.2s;
    }
    #sa-hawk-container:hover:not(.perched) #sa-hawk-tooltip { opacity: 1; }

    /* ── PANEL ── */
    #sa-panel {
      position: fixed; bottom: 120px; right: 28px; z-index: 99998;
      width: 380px; height: 560px;
      background: linear-gradient(160deg, #0d1a08 0%, #0f1f0a 60%, #12220c 100%);
      border-radius: 24px;
      border: 1px solid rgba(232,99,10,0.2);
      box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06);
      display: flex; flex-direction: column;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      transform: scale(0.8) translateY(40px);
      opacity: 0; pointer-events: none;
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 0.25s;
    }
    #sa-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1; pointer-events: all;
    }

    /* ── PANEL HEADER ── */
    #sa-header {
      padding: 20px;
      background: linear-gradient(135deg, rgba(45,80,22,0.9) 0%, rgba(27,48,9,0.95) 100%);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(232,99,10,0.15);
      position: relative; overflow: hidden; flex-shrink: 0;
    }
    #sa-header::before {
      content: ''; position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E8630A' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none;
    }
    .sa-header-inner { display: flex; align-items: center; gap: 14px; position: relative; }
    
    .sa-hawk-portrait {
      width: 50px; height: 50px; border-radius: 50%; flex-shrink: 0;
      border: 2px solid rgba(232,99,10,0.5);
      box-shadow: 0 0 16px rgba(232,99,10,0.3);
      background: radial-gradient(circle at 35% 35%, #2D5016, #1B3009);
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .sa-header-text h3 { margin: 0 0 2px; font-size: 15px; font-weight: 600; color: #fff; letter-spacing: -0.01em; }
    .sa-header-text p { margin: 0; font-size: 11px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 5px; }
    #sa-status-dot {
      display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #4ade80;
      box-shadow: 0 0 6px #4ade80; animation: sa-status-pulse 2s ease-in-out infinite; flex-shrink: 0;
    }
    @keyframes sa-status-pulse { 0%, 100% { box-shadow: 0 0 4px #4ade80; } 50% { box-shadow: 0 0 10px #4ade80, 0 0 20px rgba(74,222,128,0.3); } }

    /* ── MESSAGES ── */
    #sa-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;
      scrollbar-width: thin; scrollbar-color: rgba(232,99,10,0.15) transparent;
    }
    #sa-messages::-webkit-scrollbar { width: 4px; }
    #sa-messages::-webkit-scrollbar-thumb { background: rgba(232,99,10,0.2); border-radius: 2px; }

    .sa-msg { display: flex; align-items: flex-end; gap: 8px; max-width: 92%; animation: sa-msg-in 0.25s cubic-bezier(.34,1.56,.64,1); }
    @keyframes sa-msg-in { from { opacity: 0; transform: translateY(12px) scale(0.95); } to { opacity: 1; transform: none; } }
    .sa-msg.user { align-self: flex-end; flex-direction: row-reverse; }
    
    .sa-msg-avatar { font-size: 16px; flex-shrink: 0; }
    .sa-msg-avatar-hawk {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      overflow: hidden; border: 1px solid rgba(232,99,10,0.4);
      background: radial-gradient(circle at 35% 35%, #2D5016, #1B3009);
      display: flex; align-items: center; justify-content: center;
    }
    
    .sa-bubble-text { padding: 10px 14px; border-radius: 16px; font-size: 13.5px; line-height: 1.55; max-width: 280px; word-wrap: break-word; }
    .sa-msg.bot .sa-bubble-text { background: rgba(35,55,20,0.9); color: #e8f0e0; border-bottom-left-radius: 4px; border: 1px solid rgba(232,99,10,0.12); }
    .sa-msg.user .sa-bubble-text { background: linear-gradient(135deg, ${ACCENT}, #c55500); color: #fff; border-bottom-right-radius: 4px; }

    /* Typing dots */
    .sa-typing .sa-bubble-text { min-width: 56px; display: flex; align-items: center; gap: 5px; }
    .sa-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(232,99,10,0.7); animation: sa-bounce 1.2s infinite; }
    .sa-dot:nth-child(2) { animation-delay: 0.2s; } .sa-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes sa-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-7px); } }

    /* ── INPUT ROW ── */
    #sa-input-row {
      display: flex; align-items: center; gap: 8px; padding: 12px 14px;
      background: rgba(0,0,0,0.25); border-top: 1px solid rgba(232,99,10,0.1); flex-shrink: 0;
    }
    #sa-input {
      flex: 1; background: rgba(45,80,22,0.3); border: 1px solid rgba(232,99,10,0.2);
      border-radius: 14px; padding: 10px 14px; color: #e8f0e0;
      font-family: 'Inter', sans-serif; font-size: 13.5px; outline: none; resize: none;
      transition: border-color 0.2s, background 0.2s;
    }
    #sa-input:focus { border-color: ${ACCENT}; background: rgba(45,80,22,0.5); }
    #sa-input::placeholder { color: rgba(200,220,190,0.35); }
    #sa-send {
      width: 40px; height: 40px; border-radius: 12px; border: none; cursor: pointer;
      background: linear-gradient(135deg, ${ACCENT}, #c55500);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s, box-shadow 0.15s; flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(232,99,10,0.3);
    }
    #sa-send:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(232,99,10,0.5); }
    #sa-send svg { width: 17px; height: 17px; fill: white; }

    #sa-footer { text-align: center; padding: 7px; font-size: 9.5px; color: rgba(255,255,255,0.18); flex-shrink: 0; }

    @media (max-width: 440px) { #sa-panel { width: calc(100vw - 20px); right: 10px; bottom: 120px; } }
  `;
  document.head.appendChild(style);

  // ── Realistic Top-Down Hawk SVG ──
  // The bird is designed pointing towards the RIGHT (+X axis)
  // This means translate(x,y) with rotate(atan2(vy, vx)) maps perfectly to its visual heading.
  const hawkSVG = (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display:block;">
      <!-- Tail: Rust red with dark band, sweeping backwards (to the left) -->
      <path d="M 40 45 Q 10 20 15 50 Q 10 80 40 55 Z" fill="#CC4400" />
      <path d="M 28 35 Q 15 50 28 65 L 24 68 Q 5 50 24 32 Z" fill="#221100" />

      <!-- Top Wing -->
      <g class="sa-wing-top">
        <path d="M 35 45 C 30 15, 45 5, 55 5 C 70 15, 60 45, 55 45 Z" fill="#4B2C16"/>
        <path d="M 40 45 C 35 25, 45 15, 50 15 C 60 25, 55 45, 55 45 Z" fill="#7A4E2E"/>
      </g>

      <!-- Bottom Wing -->
      <g class="sa-wing-bottom">
        <path d="M 35 55 C 30 85, 45 95, 55 95 C 70 85, 60 55, 55 55 Z" fill="#4B2C16"/>
        <path d="M 40 55 C 35 75, 45 85, 50 85 C 60 75, 55 55, 55 55 Z" fill="#7A4E2E"/>
      </g>

      <!-- Torso -->
      <ellipse cx="45" cy="50" rx="18" ry="8" fill="#5C3318"/>
      
      <!-- Head -->
      <ellipse cx="62" cy="50" rx="9" ry="7" fill="#7A4E2E"/>
      <!-- Cream markings on head/cheeks -->
      <ellipse cx="60" cy="46" rx="5" ry="3" fill="#D4C9A8" opacity="0.6"/>
      <ellipse cx="60" cy="54" rx="5" ry="3" fill="#D4C9A8" opacity="0.6"/>
      
      <!-- Eyes -->
      <circle cx="65" cy="45.5" r="1.5" fill="#FFB000"/>
      <circle cx="65" cy="54.5" r="1.5" fill="#FFB000"/>

      <!-- Beak -->
      <path d="M 70 48 L 78 50 L 70 52 Z" fill="#D4AA40"/>
    </svg>
  `;

  // ── Build DOM ──────────────────────────────────────────────────────────────
  // The Perch (static bottom right button)
  const perch = document.createElement("button");
  perch.id = "sa-bubble";
  perch.setAttribute("aria-label", "Open Redtail chat assistant");
  perch.innerHTML = `
    <div class="sa-perch-icon">💬</div>
    <i class="sa-close-icon" title="Close chat">✕</i>
  `;

  // The Flying Hawk (absolutely positioned and animated via JS)
  const flyContainer = document.createElement("div");
  flyContainer.id = "sa-hawk-container";
  flyContainer.className = "flapping";
  flyContainer.innerHTML = `
    ${hawkSVG(80)}
    <div id="sa-hawk-tooltip">Chat with Redtail</div>
  `;

  // The Chat Panel
  const panel = document.createElement("div");
  panel.id = "sa-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Redtail chat assistant");
  panel.innerHTML = `
    <div id="sa-header">
      <div class="sa-header-inner">
        <div class="sa-hawk-portrait">
          <!-- Scaled down rotated version of the hawk for the portrait -->
          <div style="transform: rotate(-45deg)">${hawkSVG(40)}</div>
        </div>
        <div class="sa-header-text">
          <h3>${TITLE}</h3>
          <p><span id="sa-status-dot"></span> Online · Redtail Support</p>
        </div>
      </div>
    </div>
    <div id="sa-messages"></div>
    <div id="sa-input-row">
      <textarea id="sa-input" rows="1" placeholder="Ask about surveys, pricing, timelines…"></textarea>
      <button id="sa-send" title="Send" aria-label="Send message">
        <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
      </button>
    </div>
    <div id="sa-footer">🦅 Powered by Redtail AI</div>
  `;

  document.body.appendChild(perch);
  document.body.appendChild(flyContainer);
  document.body.appendChild(panel);

  // ── Flight Simulation Logic ──────────────────────────────────────────────
  let hawkX = (window.innerWidth || 1000) / 2;
  let hawkY = (window.innerHeight || 1000) / 2;
  let hawkVX = 0;
  let hawkVY = 0;
  let targetX = hawkX;
  let targetY = hawkY;
  
  // States
  let state = "soaring"; // soaring, thermalling, homing, perched
  let lastTime = 0;
  let animationFrameId;
  let thermalTimer = 0;
  let perchTimer = 0;
  let spiralDir = 1;
  let userSummoned = false;
  let isOpen = false;
  let isBotTyping = false;

  function pickNextAction() {
    // If chat is open, we shouldn't autonomously jump around, we just wait.
    if (isOpen) return;

    const rand = Math.random();
    
    // 15% chance to land autonomously to rest (only if not already homing or perched)
    if (rand < 0.15 && state !== "homing") {
      state = "homing";
      const rect = perch.getBoundingClientRect();
      targetX = rect.left + rect.width / 2 || hawkX;
      targetY = rect.top + rect.height / 2 || hawkY;
      flyContainer.classList.add("flapping");
      return;
    }
    
    const cw = window.innerWidth || 800;
    const ch = window.innerHeight || 800;

    // Pick a new random target within the window padded by 120px
    targetX = 120 + Math.random() * Math.max(0, cw - 240);
    targetY = 120 + Math.random() * Math.max(0, ch - 240);

    if (rand < 0.70) {
      // 55% chance to ride a thermal draft
      state = "thermalling";
      thermalTimer = 10000 + Math.random() * 12000; // 10 to 22 seconds spiraling
      spiralDir = Math.random() > 0.5 ? 1 : -1;
    } else {
      // 30% chance to just soar to a new point
      state = "soaring";
    }
  }

  function flightLoop(time) {
    animationFrameId = requestAnimationFrame(flightLoop);
    
    if (!time) time = performance.now();
    if (lastTime === 0) lastTime = time;

    let rawDt = time - lastTime;
    lastTime = time;
    
    if (rawDt < 0) rawDt = 0;
    const dt = Math.min(rawDt, 50) / 16.66 || 0;

    // Autonomous takeoff if rested long enough
    if (state === "perched") {
      if (!isOpen) { 
        perchTimer -= dt * 16.66;
        if (perchTimer <= 0) {
          launchBird();
        }
      }
      return;
    }

    let isHoming = (state === "homing");
    
    // Steering distance (computed early so homing speed can use it)
    const dx = isNaN(targetX) ? 0 : targetX - hawkX;
    const dy = isNaN(targetY) ? 0 : targetY - hawkY;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;

    // FASTER SPEEDS (Cross screen in ~5-10s)
    // When homing: decelerate as we approach the perch so we don't overshoot
    let homingSpeed = 12;
    let homingAccel = 0.6;
    if (isHoming && dist < 150) {
      // Smooth deceleration: scale speed down linearly as we get close
      const approach = Math.max(dist / 150, 0.08);
      homingSpeed = 12 * approach;
      homingAccel = 0.6 * approach;
    }
    const speedLimit = isHoming ? homingSpeed : (state === "thermalling" ? 3.5 : 7.0);
    const acceleration = isHoming ? homingAccel : 0.15;
    
    const isHovering = flyContainer.matches(':hover') && !isHoming;
    const currentAccel = isHovering ? 0.05 : acceleration;
    const currentLimit = isHovering ? 1.0 : speedLimit;

    // State Transitions
    if (state === "soaring" && dist < 100) {
      pickNextAction();
    }

    if (state === "thermalling") {
      thermalTimer -= dt * 16.66;
      if (thermalTimer <= 0) {
        pickNextAction();
      }
    }

    // Homing finish check (landing) — wider threshold so fast hawk can land
    if (isHoming && dist < 40) {
      state = "perched";
      flyContainer.classList.remove("flapping");
      flyContainer.classList.add("perched");
      hawkX = targetX;
      hawkY = targetY;
      
      flyContainer.style.transform = `translate(${Math.round(hawkX)}px, ${Math.round(hawkY)}px) rotate(180deg) scale(0.6)`;
      
      if (userSummoned && !isOpen) {
        togglePanelUI();
      }
      userSummoned = false;
      
      perchTimer = 15000 + Math.random() * 25000; // rest for 15-40 seconds
      return;
    }

    // Apply forces
    if (state === "thermalling" && !isHovering) {
      // Gentle pull towards thermal center
      hawkVX += (dx / dist) * 0.06 * dt;
      hawkVY += (dy / dist) * 0.06 * dt;
      
      // Tangential force for spiraling
      const tangX = -dy * spiralDir;
      const tangY = dx * spiralDir;
      const tangDist = Math.sqrt(tangX*tangX + tangY*tangY) || 1;
      
      hawkVX += (tangX / tangDist) * 0.12 * dt;
      hawkVY += (tangY / tangDist) * 0.12 * dt;
    } else {
      // Standard direct steering
      hawkVX += (dx / dist) * currentAccel * dt;
      hawkVY += (dy / dist) * currentAccel * dt;

      // Smooth random organic wandering
      if (state === "soaring" && !isHovering) {
        hawkVX += (Math.random() - 0.5) * 0.6;
        hawkVY += (Math.random() - 0.5) * 0.6;
      }
    }

    // Apply friction and speed limit
    const speed = Math.sqrt(hawkVX*hawkVX + hawkVY*hawkVY) || 0;
    if (speed > currentLimit) {
      hawkVX = (hawkVX / speed) * currentLimit;
      hawkVY = (hawkVY / speed) * currentLimit;
    }

    hawkX += hawkVX * dt;
    hawkY += hawkVY * dt;

    if (isNaN(hawkX)) hawkX = 500;
    if (isNaN(hawkY)) hawkY = 500;

    const angleDeg = Math.atan2(hawkVY, hawkVX) * (180 / Math.PI) || 0;
    const scale = isHoming ? 1.1 : 1.0;
    
    flyContainer.style.transform = `translate(${hawkX.toFixed(1)}px, ${hawkY.toFixed(1)}px) rotate(${angleDeg.toFixed(1)}deg) scale(${scale})`;
  }

  requestAnimationFrame(flightLoop);
  pickNextAction();

  // ── Chat Panel Logic & State Management ────────────────────────────────────
  const messagesEl = document.getElementById("sa-messages");
  const inputEl    = document.getElementById("sa-input");
  const sendBtn    = document.getElementById("sa-send");

  function triggerChat() {
    if (isOpen) {
      togglePanelUI();
      launchBird();
    } else {
      // Open panel immediately — don't wait for the hawk to land
      togglePanelUI();
      if (state !== "perched") {
        // Also summon the hawk home in the background
        state = "homing";
        const rect = perch.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        flyContainer.classList.add("flapping");
      }
    }
  }

  function launchBird() {
    state = "soaring";
    flyContainer.classList.remove("perched");
    flyContainer.classList.add("flapping");
    
    hawkVX = -4; // Takeoff thrust
    hawkVY = -4;
    userSummoned = false;
    pickNextAction();
  }

  function togglePanelUI() {
    isOpen = !isOpen;
    panel.classList.toggle("open", isOpen);
    perch.classList.toggle("open", isOpen);
    
    if (isOpen && messagesEl.children.length === 0) {
      setTimeout(() => addMessage("bot",
        "Hey there! 🦅 I'm the Redtail assistant. Ask me anything about surveys, pricing, timelines, or what type of survey you might need!"
      ), 400); // slight delay after landing
    }
    if (isOpen) inputEl.focus();
  }

  // ── Mini Avatar for Chat Messages ──
  function buildBotAvatar() {
    const d = document.createElement("div");
    d.className = "sa-msg-avatar-hawk";
    // Tilted upwards slightly for portrait look
    d.innerHTML = `<div style="transform: rotate(-15deg) scale(0.6); margin-left: -5px;">${hawkSVG(40)}</div>`;
    return d;
  }

  function addMessage(role, text) {
    const msg = document.createElement("div");
    msg.className = `sa-msg ${role}`;
    const bubbleText = document.createElement("div");
    bubbleText.className = "sa-bubble-text";
    bubbleText.textContent = text;

    if (role === "bot") {
      msg.appendChild(buildBotAvatar());
    } else {
      const av = document.createElement("span");
      av.className = "sa-msg-avatar";
      av.textContent = USER_AVATAR;
      msg.appendChild(av);
    }
    msg.appendChild(bubbleText);
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const msg = document.createElement("div");
    msg.className = "sa-msg bot sa-typing";
    msg.id = "sa-typing-indicator";
    msg.appendChild(buildBotAvatar());
    const bt = document.createElement("div");
    bt.className = "sa-bubble-text";
    bt.innerHTML = `<div class="sa-dot"></div><div class="sa-dot"></div><div class="sa-dot"></div>`;
    msg.appendChild(bt);
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById("sa-typing-indicator");
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isBotTyping) return;
    inputEl.value = "";
    inputEl.style.height = "auto";
    addMessage("user", text);
    isBotTyping = true;
    showTyping();

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, agent_name: AGENT_NAME }),
      });
      const data = await res.json();
      removeTyping();
      addMessage("bot", data.reply || "Sorry, I couldn't understand that.");
    } catch (err) {
      removeTyping();
      addMessage("bot", "⚠️ I can't reach the server right now. Please call us at (505) 555-0100 or email info@redtailsurvey.com.");
    } finally {
      isBotTyping = false;
    }
  }

  // ── Event Listeners ────────────────────────────────────────────────────────
  // Both the fixed bubble (perch) and the flying bird trigger the chat
  perch.addEventListener("click", triggerChat);
  flyContainer.addEventListener("click", triggerChat);
  
  // Close triggers (clicking 'X' in perch closes it)
  // The perch handles its own click but we also want to catch click outside
  
  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
  });

  // Handle window resizing
  window.addEventListener("resize", () => {
    if (state === "perched") {
      // Re-anchor to the perch if window resizes
      const rect = perch.getBoundingClientRect();
      hawkX = rect.left + rect.width / 2;
      hawkY = rect.top + rect.height / 2;
      flyContainer.style.transform = `translate(${hawkX}px, ${hawkY}px) rotate(180deg) scale(0.6)`;
    }
  });

})();
