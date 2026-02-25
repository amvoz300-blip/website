/* Stats removed */
function animateCount(el, target, duration = 1500) {
  let start = 0;
  const stepTime = Math.max(Math.floor(duration / target), 20);

  const counter = setInterval(() => {
    start++;
    el.textContent = start.toLocaleString();
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(counter);
    }
  }, stepTime);
}

function showCounts() {
  document.querySelectorAll(".count").forEach(card => {
    card.classList.add("show");
  });
}

/* EXAMPLE LIVE VALUES */
const totalServers = 128;   // API se ayega
const totalUsers = 45890;   // API se ayega

const serverEl = document.getElementById("totalServers");
const userEl = document.getElementById("totalUsers");

serverEl.textContent = "0";
userEl.textContent = "0";

setTimeout(() => {
  showCounts();
  animateCount(serverEl, totalServers);
  animateCount(userEl, totalUsers);
}, 300);
