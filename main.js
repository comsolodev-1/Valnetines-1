(function () {
  "use strict";

  const DEVELOPER_EMAIL = "com.solodev@gmail.com";

  const numerals = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI"];

  const languages = [
    { name:"English",   q:"Will you be my Valentine, my love?",               sub:"",                                                        yes:"Yes",  no:"No",    dir:"ltr" },
    { name:"Español",   q:"¿Quieres ser mi San Valentín, mi amor?",            sub:"",                                                        yes:"Sí",   no:"No",    dir:"ltr" },
    { name:"Français",  q:"Veux-tu être mon Valentin, mon amour ?",            sub:"",                                                        yes:"Oui",  no:"Non",   dir:"ltr" },
    { name:"日本語",     q:"私のバレンタインになってくれる？愛しい人",              sub:"Watashi no barentain ni natte kureru? Itoshii hito",       yes:"はい", no:"いいえ", dir:"ltr" },
    { name:"中文",       q:"你愿意做我的情人吗，我的爱？",                         sub:"Nǐ yuànyì zuò wǒ de qíngrén ma, wǒ de ài?",               yes:"是的", no:"不",    dir:"ltr" },
    { name:"한국어",     q:"내 발렌타인이 되어줄래, 내 사랑?",                    sub:"Nae ballentaini doeeojullae, nae sarang?",                 yes:"네",   no:"아니요", dir:"ltr" },
    { name:"Português", q:"Queres ser o meu Valentine, meu amor?",             sub:"",                                                        yes:"Sim",  no:"Não",   dir:"ltr" },
    { name:"Italiano",  q:"Vuoi essere il mio San Valentino, amore mio?",      sub:"",                                                        yes:"Sì",   no:"No",    dir:"ltr" },
    { name:"Deutsch",   q:"Willst du mein Valentinstag sein, meine Liebe?",    sub:"",                                                        yes:"Ja",   no:"Nein",  dir:"ltr" },
    { name:"Русский",   q:"Ты будешь моим Валентином, моя любовь?",            sub:"Ty budesh' moim Valentinom, moya lyubov'?",                yes:"Да",   no:"Нет",   dir:"ltr" },
    { name:"العربية",   q:"هل تكون/تكونين فالنتيني، حبيبي/حبيبتي؟",           sub:"Hal takun/takunin Valentine-i, habibi/habibati?",          yes:"نعم",  no:"لا",    dir:"rtl" }
  ];

  const scene      = document.getElementById("scene");
  const stage      = document.getElementById("stage");
  const counterEl  = document.getElementById("counter");
  const questionEl = document.getElementById("question");
  const subtitleEl = document.getElementById("subtitle");
  const yesBtn     = document.getElementById("yesBtn");
  const noBtn      = document.getElementById("noBtn");
  const noSlot     = document.getElementById("noSlot");
  const muteBtn    = document.getElementById("muteBtn");
  const page2      = document.getElementById("page2");
  const page3      = document.getElementById("page3");
  const page4      = document.getElementById("page4");
  const windLayer  = document.getElementById("windLayer");
  const leafLayer  = document.getElementById("leafLayer");
  const rainLayer  = document.getElementById("rainLayer");
  const arcPath    = document.querySelector(".arc-path");
  const sunDot     = document.getElementById("sunDot");

  const isSmall  = window.innerWidth < 640;
  const leafPath = "M8,15 C2,12 1,4 8,1 C15,4 14,12 8,15 Z M8,1 L8,15";

  for (let i = 0; i < (isSmall ? 4 : 7); i++) {
    const el = document.createElement("div");
    el.className = "wind-line";
    el.style.top = (10 + Math.random() * 70) + "%";
    el.style.animationDuration = (6 + Math.random() * 4) + "s";
    el.style.animationDelay = (-Math.random() * 8) + "s";
    windLayer.appendChild(el);
  }

  for (let i = 0; i < (isSmall ? 5 : 8); i++) {
    const wrap = document.createElement("div");
    wrap.className = "leaf";
    wrap.style.left = (Math.random() * 92) + "%";
    wrap.style.animationDuration = (7 + Math.random() * 5) + "s";
    wrap.style.animationDelay = (-Math.random() * 10) + "s";
    wrap.innerHTML = '<svg viewBox="0 0 16 16"><path d="' + leafPath + '"/></svg>';
    leafLayer.appendChild(wrap);
  }

  for (let i = 0; i < (isSmall ? 22 : 40); i++) {
    const el = document.createElement("div");
    el.className = "rain-line";
    el.style.left = (Math.random() * 100) + "%";
    el.style.animationDuration = (0.55 + Math.random() * 0.4) + "s";
    el.style.animationDelay = (-Math.random() * 1) + "s";
    rainLayer.appendChild(el);
  }

  const AudioMgr = (function () {
    let ctx = null, master = null, muted = false;
    let windNode = null, windGain = null, rainNode = null, rainGain = null;
    let supported = true;

    function ensure() {
      if (!supported) return false;
      try {
        if (!ctx) {
          const Ctor = window.AudioContext || window.webkitAudioContext;
          if (!Ctor) { supported = false; return false; }
          ctx = new Ctor();
          master = ctx.createGain();
          master.gain.value = muted ? 0 : 0.4;
          master.connect(ctx.destination);
        }
        if (ctx.state === "suspended") ctx.resume();
        return true;
      } catch (e) {
        supported = false;
        return false;
      }
    }

    function noiseBuffer() {
      const size = 2 * ctx.sampleRate;
      const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
      return buf;
    }

    function tone(freq, duration, type, delay, vol) {
      if (!ensure()) return;
      try {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = 0;
        osc.connect(g);
        g.connect(master);
        const t = ctx.currentTime + (delay || 0);
        g.gain.linearRampToValueAtTime(vol, t + 0.03);
        g.gain.linearRampToValueAtTime(0, t + duration);
        osc.start(t);
        osc.stop(t + duration + 0.05);
      } catch (e) {}
    }

    function playNo()  { tone(392, 0.32, "sine", 0, 0.09); }
    function playYes() { [523.25, 659.25, 784].forEach((f, i) => tone(f, 0.5, "sine", i * 0.14, 0.1)); }

    function setWind(active) {
      if (!ensure()) return;
      try {
        if (active && !windNode) {
          windNode = ctx.createBufferSource();
          windNode.buffer = noiseBuffer();
          windNode.loop = true;
          const filt = ctx.createBiquadFilter();
          filt.type = "bandpass";
          filt.frequency.value = 500;
          filt.Q.value = 0.6;
          windGain = ctx.createGain();
          windGain.gain.value = 0;
          windNode.connect(filt);
          filt.connect(windGain);
          windGain.connect(master);
          windNode.start();
          windGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.6);
        } else if (!active && windNode) {
          windGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
          const n = windNode; windNode = null; windGain = null;
          setTimeout(() => { try { n.stop(); } catch (e) {} }, 1100);
        }
      } catch (e) {}
    }

    function setRain(active) {
      if (!ensure()) return;
      try {
        if (active && !rainNode) {
          rainNode = ctx.createBufferSource();
          rainNode.buffer = noiseBuffer();
          rainNode.loop = true;
          const filt = ctx.createBiquadFilter();
          filt.type = "lowpass";
          filt.frequency.value = 2000;
          rainGain = ctx.createGain();
          rainGain.gain.value = 0;
          rainNode.connect(filt);
          filt.connect(rainGain);
          rainGain.connect(master);
          rainNode.start();
          rainGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.6);
        } else if (!active && rainNode) {
          rainGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
          const n = rainNode; rainNode = null; rainGain = null;
          setTimeout(() => { try { n.stop(); } catch (e) {} }, 1100);
        }
      } catch (e) {}
    }

    function toggleMute() {
      if (!ensure()) return muted;
      try {
        muted = !muted;
        master.gain.linearRampToValueAtTime(muted ? 0 : 0.4, ctx.currentTime + 0.15);
        return muted;
      } catch (e) { return muted; }
    }

    return { playNo, playYes, setWind, setRain, toggleMute };
  })();

  let noCount = 0, langIndex = 0, isRoaming = false;
  let reducedMotion = false;
  try { reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  let totalLen = 0;
  try { totalLen = arcPath.getTotalLength(); } catch (e) {}
  let sunX = 40, sunY = 230, sunTargetX = 40, sunTargetY = 230;

  function weatherStage(n) {
    if (n <= 0) return 0;
    if (n <= 3) return 1;
    if (n <= 7) return 2;
    return 3;
  }

  function renderLanguage(i) {
    const L = languages[i];
    counterEl.textContent = numerals[i] + " — " + L.name;
    questionEl.textContent = L.q;
    questionEl.setAttribute("dir", L.dir);
    subtitleEl.textContent = L.sub || "";
    yesBtn.textContent = L.yes;
    noBtn.textContent = L.no;
  }

  function setWeather(s) {
    scene.setAttribute("data-weather", String(s));
    AudioMgr.setWind(s === 1 || s === 2);
    AudioMgr.setRain(s === 3);
    try {
      const pt = arcPath.getPointAtLength(Math.min(noCount / 10, 1) * totalLen);
      sunTargetX = pt.x;
      sunTargetY = pt.y;
    } catch (e) {}
  }

  renderLanguage(0);
  setWeather(0);

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  window.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });

  let btnX = 0, btnY = 0, targetX = 0, targetY = 0, lastWander = 0, dodgeCount = 0;
  const DODGE_RADIUS = 130;
  const MAX_DODGES   = 5;

  function initButtonPos() {
    const r = noSlot.getBoundingClientRect();
    btnX = r.left; btnY = r.top;
    targetX = btnX; targetY = btnY;
  }

  function pickWanderTarget() {
    const bw = noBtn.offsetWidth || 118, bh = noBtn.offsetHeight || 50;
    const margin = 24;
    const topMargin = Math.min(100, window.innerHeight * 0.16);
    targetX = margin + Math.random() * (window.innerWidth  - 2 * margin - bw);
    targetY = topMargin + Math.random() * (window.innerHeight - topMargin - margin - bh);
  }

  function tick() {
    const bw = noBtn.offsetWidth || 118, bh = noBtn.offsetHeight || 50;
    const topMargin = Math.min(100, window.innerHeight * 0.16);

    if (isRoaming && !reducedMotion) {
      const now = performance.now();
      if (now - lastWander > 1700) { pickWanderTarget(); lastWander = now; }
      const dx = (btnX + bw / 2) - mouseX;
      const dy = (btnY + bh / 2) - mouseY;
      if (Math.hypot(dx, dy) < DODGE_RADIUS && dodgeCount < MAX_DODGES) {
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
        let nx = mouseX + Math.cos(angle) * (DODGE_RADIUS + 160) - bw / 2;
        let ny = mouseY + Math.sin(angle) * (DODGE_RADIUS + 160) - bh / 2;
        nx = Math.max(20, Math.min(window.innerWidth  - bw - 20, nx));
        ny = Math.max(topMargin, Math.min(window.innerHeight - bh - 20, ny));
        targetX = nx; targetY = ny; lastWander = now; dodgeCount++;
      }
    } else {
      const r = noSlot.getBoundingClientRect();
      targetX = r.left; targetY = r.top;
    }

    btnX += (targetX - btnX) * 0.15;
    btnY += (targetY - btnY) * 0.15;
    noBtn.style.left = btnX + "px";
    noBtn.style.top  = btnY + "px";

    sunX += (sunTargetX - sunX) * 0.06;
    sunY += (sunTargetY - sunY) * 0.06;
    sunDot.setAttribute("transform", "translate(" + sunX + "," + sunY + ")");

    requestAnimationFrame(tick);
  }

  function handleNo() {
    noCount++;
    langIndex  = (langIndex + 1) % languages.length;
    isRoaming  = langIndex !== 0;
    dodgeCount = 0;
    AudioMgr.playNo();
    renderLanguage(langIndex);
    setWeather(weatherStage(noCount));
  }

  function handleYes() {
    isRoaming = false;
    AudioMgr.playYes();
    noCount = 0;
    setWeather(0);
    setTimeout(() => {
      stage.style.opacity = "0";
      noBtn.style.opacity = "0";
      noBtn.style.pointerEvents = "none";
    }, 1300);
    setTimeout(() => {
      scene.style.opacity = "0";
      setTimeout(() => {
        scene.style.pointerEvents = "none";
        page2.hidden = false;
        requestAnimationFrame(() => page2.classList.add("show"));
      }, 800);
    }, 2400);
  }

  noBtn.addEventListener("click", handleNo);
  yesBtn.addEventListener("click", handleYes);
  muteBtn.addEventListener("click", () => {
    const m = AudioMgr.toggleMute();
    muteBtn.textContent = m ? "Sound: Off" : "Sound: On";
  });
  window.addEventListener("resize", () => { if (!isRoaming) initButtonPos(); });
  initButtonPos();
  requestAnimationFrame(tick);

  const planNames = { A: "The Quiet Morning", B: "The Golden Afternoon", C: "The Candlelit Evening" };
  const planOrder = ["A", "B", "C"];
  const carCards  = planOrder.map(p => document.getElementById("planCard" + p));
  const carDots   = Array.from(document.querySelectorAll("#carouselDots .dot"));
  let carIndex = 0;

  function showCard(i) {
    carIndex = (i + carCards.length) % carCards.length;
    carCards.forEach((c, idx) => {
      c.classList.toggle("active", idx === carIndex);
    });
    carDots.forEach((d, idx) => d.classList.toggle("active", idx === carIndex));
  }

  document.getElementById("carPrev").addEventListener("click", () => showCard(carIndex - 1));
  document.getElementById("carNext").addEventListener("click", () => showCard(carIndex + 1));
  carDots.forEach(d => d.addEventListener("click", () => showCard(parseInt(d.dataset.index, 10))));
  document.addEventListener("keydown", e => {
    if (page2.hidden) return;
    if (e.key === "ArrowLeft")  showCard(carIndex - 1);
    if (e.key === "ArrowRight") showCard(carIndex + 1);
  });

  let touchStartX = 0;
  document.getElementById("carouselStage").addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.getElementById("carouselStage").addEventListener("touchend",   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) showCard(dx < 0 ? carIndex + 1 : carIndex - 1);
  });

  function buildMailto(plan) {
    const card    = document.getElementById("planCard" + plan);
    const title   = card.querySelector(".plan-title").textContent.trim();
    const tagline = card.querySelector(".plan-tagline").textContent.trim();
    const lines   = Array.from(card.querySelectorAll(".plan-items li")).map(li => {
      const time   = li.querySelector(".plan-time").textContent.trim();
      const strong = li.querySelector(".plan-activity strong").textContent.trim();
      const note   = li.querySelector(".plan-activity span").textContent.trim();
      return time + " — " + strong + ": " + note;
    });
    const subject = "Valentine Plan Selected: Plan " + plan + " — " + title;
    const body    = "Plan " + plan + " — " + title + "\n" + tagline + "\n\n" + lines.join("\n") + "\n\n— sent from the Valentine site";
    return "mailto:" + DEVELOPER_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  async function downloadPNG(plan) {
    if (typeof html2canvas !== "function") { alert("Export tool still loading — try again in a moment."); return; }
    const card   = document.getElementById("planCard" + plan);
    const canvas = await html2canvas(card, { backgroundColor: "#FFFCF8", scale: 2 });
    const a = document.createElement("a");
    a.download = "valentine-plan-" + plan + ".png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  async function downloadPDF(plan) {
    if (typeof html2canvas !== "function" || !window.jspdf) { alert("Export tool still loading — try again in a moment."); return; }
    const card   = document.getElementById("planCard" + plan);
    const canvas = await html2canvas(card, { backgroundColor: "#FFFCF8", scale: 2 });
    const { jsPDF } = window.jspdf;
    const pdf  = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pw   = pdf.internal.pageSize.getWidth();
    const ph   = pdf.internal.pageSize.getHeight();
    const iw   = pw - 80;
    const ih   = iw * (canvas.height / canvas.width);
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 40, Math.max(40, (ph - ih) / 2), iw, Math.min(ih, ph - 80));
    pdf.save("valentine-plan-" + plan + ".pdf");
  }

  document.querySelectorAll(".plan-actions .btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const plan   = btn.dataset.plan;
      if (action === "png") {
        const orig = btn.textContent; btn.disabled = true; btn.textContent = "…";
        downloadPNG(plan).finally(() => { btn.disabled = false; btn.textContent = orig; });
      } else if (action === "pdf") {
        const orig = btn.textContent; btn.disabled = true; btn.textContent = "…";
        downloadPDF(plan).finally(() => { btn.disabled = false; btn.textContent = orig; });
      } else if (action === "email") {
        openModal(plan);
      }
    });
  });

  const modalOverlay  = document.getElementById("modalOverlay");
  const modalStep1    = document.getElementById("modalStep1");
  const modalConfirmed = document.getElementById("modalConfirmed");
  const modalInput    = document.getElementById("modalInput");
  const modalConfirm  = document.getElementById("modalConfirm");
  const modalCancel   = document.getElementById("modalCancel");
  const modalClose    = document.getElementById("modalClose");
  const modalCopy     = document.getElementById("modalCopy");
  const modalPlanName  = document.getElementById("modalPlanName");
  const modalPlanName2 = document.getElementById("modalPlanName2");
  const modalEmailText = document.getElementById("modalEmailText");
  let lastFocused = null, activePlan = null;

  function openModal(plan) {
    activePlan = plan;
    const label = "Plan " + plan + " — " + planNames[plan];
    modalPlanName.textContent  = label;
    modalPlanName2.textContent = label;
    modalEmailText.textContent = DEVELOPER_EMAIL;
    modalInput.value = "";
    modalConfirm.disabled = true;
    modalStep1.style.display = "";
    modalConfirmed.classList.remove("show");
    lastFocused = document.activeElement;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => modalInput.focus(), 50);
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    if (lastFocused) lastFocused.focus();
  }

  modalInput.addEventListener("input", () => {
    modalConfirm.disabled = modalInput.value.trim().toLowerCase() !== "sure";
  });
  modalInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !modalConfirm.disabled) modalConfirm.click();
  });
  modalConfirm.addEventListener("click", () => {
    if (activePlan) window.location.href = buildMailto(activePlan);
    modalStep1.style.display = "none";
    modalConfirmed.classList.add("show");
  });
  modalCopy.addEventListener("click", () => {
    const orig = modalCopy.textContent;
    const done = () => { modalCopy.textContent = "Copied"; setTimeout(() => modalCopy.textContent = orig, 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(DEVELOPER_EMAIL).then(done).catch(done);
    } else { done(); }
  });
  modalCancel.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
  });

  function goTo(from, to) {
    from.classList.remove("show");
    setTimeout(() => {
      from.style.pointerEvents = "none";
      to.hidden = false;
      requestAnimationFrame(() => to.classList.add("show"));
    }, 700);
  }

  document.getElementById("proceedBtn").addEventListener("click",  () => goTo(page2, page3));
  document.getElementById("proceedBtn2").addEventListener("click", () => goTo(page3, page4));

  const bouquetImg = document.getElementById("bouquetImg");
  if (bouquetImg) {
    bouquetImg.addEventListener("error", () => {
      const wrap = document.getElementById("bouquetWrap");
      if (wrap) wrap.style.display = "none";
    });
  }

})();