const storyContainer = document.getElementById("story");
const input = document.getElementById("input");
const pageSound = document.getElementById("pageSound");

let storyEntries = [];
let currentPage = 0;
const entriesPerPage = 5;

function loadStory() {
  const saved = localStorage.getItem("epicStoryArray");
  if (saved) {
    storyEntries = JSON.parse(saved);
    renderStory();
  }
}

function saveStory() {
  localStorage.setItem("epicStoryArray", JSON.stringify(storyEntries));
}

function renderStory() {
  storyContainer.classList.add("page-enter");

  setTimeout(() => {
    storyContainer.classList.remove("page-enter");
  }, 600);

  storyContainer.innerHTML = "";

  const start = currentPage * entriesPerPage;
  const end = start + entriesPerPage;
  const pageEntries = storyEntries.slice(start, end);

  pageEntries.forEach((entry, index) => {
    const p = document.createElement("p");
    p.textContent = entry;

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.title = "Delete this part";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      const globalIndex = start + index;
      storyEntries.splice(globalIndex, 1);
      saveStory();
      renderStory();
    };

    p.appendChild(delBtn);
    storyContainer.appendChild(p);
  });

  playPageSound();
}

function playPageSound() {
  pageSound.currentTime = 0;
  pageSound.play();
}

function addToStory() {
  const addition = input.value.trim();
  if (addition) {
    storyEntries.push(addition);
    saveStory();
    goToLastPage();
    input.value = "";
  }
}

function goToLastPage() {
  currentPage = Math.floor((storyEntries.length - 1) / entriesPerPage);
  renderStory();
}

function readStory() {
  const fullStory = storyEntries.join(" ");
  const utterance = new SpeechSynthesisUtterance(fullStory);
  speechSynthesis.speak(utterance);
}

function startSpeech() {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
  };

  recognition.onerror = (event) => {
    alert("Speech recognition error: " + event.error);
  };
}

const nav = document.createElement("div");
nav.className = "buttons";
nav.innerHTML = `
  <button onclick="prevPage()">⬅️ Previous</button>
  <button onclick="nextPage()">Next ➡️</button>
`;
document.querySelector(".book").appendChild(nav);

function nextPage() {
  const maxPage = Math.floor((storyEntries.length - 1) / entriesPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    renderStory();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderStory();
  }
}

loadStory();
