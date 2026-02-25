(function () {
  let locked = false;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // agar bottom tak pahuch gaye
    if (scrollTop + windowHeight >= docHeight - 2) {
      if (!locked) {
        locked = true;

        // exact bottom pe lock
        window.scrollTo({
          top: docHeight - windowHeight,
          behavior: "auto"
        });

        // scroll disable
        document.body.style.overflowY = "hidden";
      }
    }
  });
})();
