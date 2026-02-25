/* MENU TOGGLE */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

/* COMMAND COPY */
document.querySelectorAll('.cmd').forEach(cmd => {
  cmd.addEventListener('click', () => {
    const text = cmd.getAttribute('data-copy');
    navigator.clipboard.writeText(text);
    cmd.classList.add('copied');
    setTimeout(() => cmd.classList.remove('copied'), 600);
  });
});
