
"use strict";

const $ = (s) => document.querySelector(s);
const nav = $("#navigation");
const menuToggle = $("#menuToggle");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

$("#year").textContent = new Date().getFullYear();

const randomStories = [
  "Aku membuka kulkas, menatap isinya, lalu menutupnya. Lima menit kemudian, berharap ada update.",
  "Niat tidur cepat. Tiba-tiba otak mengadakan rapat tahunan pukul dua pagi.",
  "Baterai tinggal satu persen, tapi rasa percaya diri masih seratus persen.",
  "Mencari HP sambil memegang HP. Teknologi memang sudah terlalu maju.",
  "Katanya waktu adalah uang. Pantas saja rebahan terasa gratis.",
  "Buka aplikasi untuk satu hal. Keluar aplikasi sambil lupa tujuan hidup selama tiga detik.",
  "Alarm berbunyi. Aku dan alarm sepakat untuk tidak melanjutkan hubungan ini.",
  "Rencana hari ini produktif. Pelaksanaannya masih menunggu persetujuan semesta.",
  "Kalau rebahan termasuk olahraga, mungkin aku sudah atlet nasional.",
  "Aku bukan malas, cuma sedang menghemat gerakan untuk masa depan."
];

$("#randomBtn").addEventListener("click", () => {
  const output = $("#randomText");
  const current = output.textContent;
  const choices = randomStories.filter((item) => item !== current);
  output.textContent = choices[Math.floor(Math.random() * choices.length)];
});

const messageInput = $("#messageInput");
const charCount = $("#charCount");
const savedMessages = $("#savedMessages");
const messageStatus = $("#messageStatus");
const STORAGE_KEY = "juuna-messages-v1";

function getMessages() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value)
      ? value.filter((item) =>
          item && typeof item.text === "string" &&
          typeof item.id === "string"
        ).slice(0, 30)
      : [];
  } catch {
    return [];
  }
}

function storeMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    return true;
  } catch {
    messageStatus.textContent = "Penyimpanan gagal. Salin pesanmu terlebih dahulu.";
    return false;
  }
}

function renderMessages() {
  savedMessages.replaceChildren();
  getMessages().forEach((message) => {
    const card = document.createElement("article");
    card.className = "saved-message";
    const text = document.createElement("p");
    text.textContent = message.text;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "HAPUS PESAN";
    remove.addEventListener("click", () => {
      if (storeMessages(getMessages().filter((item) => item.id !== message.id))) {
        renderMessages();
        messageStatus.textContent = "Pesan dihapus.";
      }
    });
    card.append(text, remove);
    savedMessages.append(card);
  });
}

messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 2000`;
});

$("#saveMessage").addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text) {
    messageStatus.textContent = "Tulis pesan terlebih dahulu.";
    return;
  }
  const messages = getMessages();
  if (messages.length >= 30) {
    messageStatus.textContent = "Maksimal 30 pesan. Hapus pesan lama dahulu.";
    return;
  }
  messages.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text
  });
  if (storeMessages(messages)) {
    messageInput.value = "";
    charCount.textContent = "0 / 2000";
    messageStatus.textContent = "Pesan tersimpan di perangkat ini.";
    renderMessages();
  }
});

renderMessages();

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      nav.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, { rootMargin: "-25% 0px -60% 0px" });

  sections.forEach((section) => observer.observe(section));
  }
    

/* JUUNA Playground */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const tabs = document.querySelectorAll(".play-tab");
  if (!tabs.length) return;

  $("#year").textContent = new Date().getFullYear();

  const panels = document.querySelectorAll(".tool-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => {
        panel.hidden = panel.id !== tab.dataset.tool;
      });
    });
  });

  const ballCanvas = $("#ballCanvas");
  const ballCtx = ballCanvas.getContext("2d");
  const ball = { x: 400, y: 175, r: 16, vx: 0, vy: 0 };
  let ballFrame = 0;
  let dragging = false;

  function drawBall() {
    const w = ballCanvas.width;
    const h = ballCanvas.height;
    ballCtx.clearRect(0, 0, w, h);
    ballCtx.strokeStyle = "#242424";
    ballCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ballCtx.beginPath(); ballCtx.moveTo(x, 0); ballCtx.lineTo(x, h); ballCtx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ballCtx.beginPath(); ballCtx.moveTo(0, y); ballCtx.lineTo(w, y); ballCtx.stroke();
    }
    ballCtx.beginPath();
    ballCtx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ballCtx.fillStyle = "#f1f1f1";
    ballCtx.fill();
    ballCtx.beginPath();
    ballCtx.arc(ball.x - 5, ball.y - 5, 4, 0, Math.PI * 2);
    ballCtx.fillStyle = "#999";
    ballCtx.fill();
  }

  function animateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= 0.94;
    ball.vy *= 0.94;
    if (Math.abs(ball.vx) < 0.05) ball.vx = 0;
    if (Math.abs(ball.vy) < 0.05) ball.vy = 0;
    ball.x = Math.max(ball.r, Math.min(ballCanvas.width - ball.r, ball.x));
    ball.y = Math.max(ball.r, Math.min(ballCanvas.height - ball.r, ball.y));
    drawBall();
    ballFrame = requestAnimationFrame(animateBall);
  }

  animateBall();

  function ballPosition(event) {
    const rect = ballCanvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * ballCanvas.width / rect.width,
      y: (event.clientY - rect.top) * ballCanvas.height / rect.height
    };
  }

  ballCanvas.addEventListener("pointerdown", (event) => {
    const pos = ballPosition(event);
    if (Math.hypot(pos.x - ball.x, pos.y - ball.y) > ball.r + 18) return;
    dragging = true;
    ballCanvas.setPointerCapture(event.pointerId);
    ball.vx = 0; ball.vy = 0;
  });

  ballCanvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const pos = ballPosition(event);
    ball.x = Math.max(ball.r, Math.min(ballCanvas.width - ball.r, pos.x));
    ball.y = Math.max(ball.r, Math.min(ballCanvas.height - ball.r, pos.y));
    drawBall();
  });

  ballCanvas.addEventListener("pointerup", () => { dragging = false; });
  ballCanvas.addEventListener("pointercancel", () => { dragging = false; });

  function moveBall(dx, dy) {
    ball.vx += dx;
    ball.vy += dy;
    ball.vx = Math.max(-9, Math.min(9, ball.vx));
    ball.vy = Math.max(-9, Math.min(9, ball.vy));
  }

  document.querySelectorAll("[data-dir]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dirs = {
        up: [0, -3], down: [0, 3], left: [-3, 0], right: [3, 0]
      };
      const [dx, dy] = dirs[btn.dataset.dir];
      moveBall(dx, dy);
    });
  });

  $("#ballReset").addEventListener("click", () => {
    ball.x = 400; ball.y = 175; ball.vx = 0; ball.vy = 0; drawBall();
  });

  window.addEventListener("keydown", (event) => {
    if (!$("#ball").hidden && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      const keys = {
        ArrowUp: [0, -3], ArrowDown: [0, 3],
        ArrowLeft: [-3, 0], ArrowRight: [3, 0]
      };
      if (keys[event.key]) {
        event.preventDefault();
        moveBall(...keys[event.key]);
      }
    }
  });

  /* Drawing canvas */
  const canvas = $("#drawCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  let drawing = false;
  let erasing = false;
  let lastPoint = null;

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width / rect.width,
      y: (event.clientY - rect.top) * canvas.height / rect.height
    };
  }

  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    lastPoint = pointFromEvent(event);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!drawing || !lastPoint) return;
    const point = pointFromEvent(event);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = erasing ? "#ffffff" : $("#drawColor").value;
    ctx.lineWidth = Number($("#drawSize").value) * canvas.width / canvas.getBoundingClientRect().width;
    ctx.stroke();
    lastPoint = point;
  });

  function stopDrawing() { drawing = false; lastPoint = null; }
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);

  $("#eraserBtn").addEventListener("click", () => {
    erasing = !erasing;
    $("#eraserBtn").textContent = erasing ? "Eraser: ON" : "Eraser";
  });

  $("#clearCanvas").addEventListener("click", () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  $("#downloadCanvas").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "juuna-artwork.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  /* Word studio */
  const wordTitle = $("#wordTitle");
  const wordBody = $("#wordBody");
  const wordPreview = $("#wordPreview");
  const wordStatus = $("#wordStatus");

  function updateWordPreview() {
    const title = wordTitle.value.trim();
    wordPreview.textContent = title
      ? `${title}\n\n${wordBody.value || "Your words will appear here."}`
      : wordBody.value || "Your words will appear here.";
    $("#wordCount").textContent = `${wordBody.value.length} / 5000`;
  }

  wordTitle.addEventListener("input", updateWordPreview);
  wordBody.addEventListener("input", updateWordPreview);

  $("#copyWords").addEventListener("click", async () => {
    const content = [wordTitle.value.trim(), wordBody.value.trim()].filter(Boolean).join("\n\n");
    if (!content) { wordStatus.textContent = "Tulis sesuatu terlebih dahulu."; return; }
    try {
      await navigator.clipboard.writeText(content);
      wordStatus.textContent = "Teks berhasil disalin.";
    } catch {
      wordBody.focus();
      wordBody.select();
      wordStatus.textContent = "Pilih teks lalu salin secara manual.";
    }
  });

  $("#downloadWords").addEventListener("click", () => {
    const content = [wordTitle.value.trim(), wordBody.value.trim()].filter(Boolean).join("\n\n");
    if (!content) { wordStatus.textContent = "Tulis sesuatu terlebih dahulu."; return; }
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "juuna-words.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  $("#saveWords").addEventListener("click", () => {
    try {
      localStorage.setItem("juuna-word-draft", JSON.stringify({
        title: wordTitle.value,
        body: wordBody.value
      }));
      wordStatus.textContent = "Draft tersimpan di perangkat ini.";
    } catch {
      wordStatus.textContent = "Penyimpanan tidak tersedia.";
    }
  });

  try {
    const draft = JSON.parse(localStorage.getItem("juuna-word-draft") || "null");
    if (draft && typeof draft.title === "string" && typeof draft.body === "string") {
      wordTitle.value = draft.title;
      wordBody.value = draft.body;
      updateWordPreview();
    }
  } catch {}

  /* Tic-Tac-Toe */
  const ticCells = [...document.querySelectorAll("[data-cell]")];
  const ticStatus = $("#ticStatus");
  let ticBoard = Array(9).fill("");
  let ticTurn = "X";
  let ticActive = true;
  const winLines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  function resetTic() {
    ticBoard = Array(9).fill("");
    ticTurn = "X";
    ticActive = true;
    ticStatus.textContent = "Giliran X.";
    ticCells.forEach((cell) => {
      cell.textContent = "";
      cell.disabled = false;
    });
  }

  ticCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const i = Number(cell.dataset.cell);
      if (!ticActive || ticBoard[i]) return;
      ticBoard[i] = ticTurn;
      cell.textContent = ticTurn;
      cell.disabled = true;

      if (winLines.some((line) => line.every((n) => ticBoard[n] === ticTurn))) {
        ticStatus.textContent = `${ticTurn} menang!`;
        ticActive = false;
        return;
      }
      if (ticBoard.every(Boolean)) {
        ticStatus.textContent = "Seri. Coba lagi!";
        ticActive = false;
        return;
      }
      ticTurn = ticTurn === "X" ? "O" : "X";
      ticStatus.textContent = `Giliran ${ticTurn}.`;
    });
  });

  $("#ticReset").addEventListener("click", resetTic);

  /* Reflex test */
  const reflexTarget = $("#reflexTarget");
  const reflexResult = $("#reflexResult");
  let reflexState = "idle";
  let readyAt = 0;
  let reflexTimeout = null;
  let reflexBest = null;

  function resetReflex() {
    clearTimeout(reflexTimeout);
    reflexState = "idle";
    reflexTarget.className = "reflex-target";
    reflexTarget.textContent = "Tunggu sampai layar berubah putih.";
  }

  $("#reflexStart").addEventListener("click", () => {
    clearTimeout(reflexTimeout);
    reflexState = "waiting";
    reflexTarget.className = "reflex-target";
    reflexTarget.textContent = "Tunggu...";
    const delay = 1500 + Math.random() * 3500;
    reflexTimeout = setTimeout(() => {
      if (reflexState !== "waiting") return;
      reflexState = "ready";
      readyAt = performance.now();
      reflexTarget.classList.add("ready");
      reflexTarget.textContent = "SEKARANG! KLIK!";
    }, delay);
  });

  reflexTarget.addEventListener("click", () => {
    if (reflexState === "waiting") {
      clearTimeout(reflexTimeout);
      reflexState = "idle";
      reflexTarget.className = "reflex-target too-soon";
      reflexTarget.textContent = "Terlalu cepat. Mulai lagi.";
      reflexResult.textContent = "Klik setelah layar berubah putih.";
    } else if (reflexState === "ready") {
      const ms = Math.round(performance.now() - readyAt);
      reflexBest = reflexBest === null ? ms : Math.min(reflexBest, ms);
      reflexState = "idle";
      reflexTarget.className = "reflex-target";
      reflexTarget.textContent = `${ms} ms`;
      reflexResult.textContent = `Hasil: ${ms} ms · Best: ${reflexBest} ms`;
    }
  });

  /* Guess the number */
  let secret = 1 + Math.floor(Math.random() * 100);
  let attempts = 0;
  let guessFinished = false;

  function resetGuess() {
    secret = 1 + Math.floor(Math.random() * 100);
    attempts = 0;
    guessFinished = false;
    $("#guessInput").value = "";
    $("#guessStatus").textContent = "Angka rahasia baru sudah dipilih.";
    $("#guessAttempts").textContent = "Percobaan: 0";
  }

  $("#guessForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (guessFinished) {
      $("#guessStatus").textContent = "Mulai angka baru untuk bermain lagi.";
      return;
    }

    const input = $("#guessInput");
    const value = Number(input.value);
    if (!Number.isInteger(value) || value < 1 || value > 100) {
      $("#guessStatus").textContent = "Masukkan bilangan bulat 1 sampai 100.";
      return;
    }

    attempts++;
    $("#guessAttempts").textContent = `Percobaan: ${attempts}`;

    if (value === secret) {
      $("#guessStatus").textContent = `Benar! Angkanya ${secret}. Total ${attempts} percobaan.`;
      guessFinished = true;
    } else {
      $("#guessStatus").textContent = value < secret
        ? "Terlalu kecil. Coba angka lebih besar."
        : "Terlalu besar. Coba angka lebih kecil.";
    }
    input.select();
  });

  $("#guessReset").addEventListener("click", resetGuess);
})();
      
