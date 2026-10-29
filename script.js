
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
    
