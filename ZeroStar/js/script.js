/* ================= MENU TOGGLE ================= */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});


/* ================= SCROLL LOCK (SAFE) ================= */
/* Sirf body overflow se lock, events block nahi */
document.body.style.overflow = "hidden";

/* ================= INVITE BUTTON ================= */
const inviteBtn = document.querySelector(".invite-btn");

if (inviteBtn) {
  inviteBtn.addEventListener("click", () => {
    window.open(
      "https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&scope=bot%20applications.commands&permissions=8",
      "_blank"
    );
  });
}
