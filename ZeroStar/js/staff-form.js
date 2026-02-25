const form = document.getElementById("staffForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;
  const data = {};

  document.querySelectorAll("[required]").forEach(el => {
    if (!el.value.trim()) {
      el.classList.add("error");
      valid = false;
    }
    data[el.name] = el.value.trim();
  });

  if (!valid) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    await fetch("http://localhost:3000/api/staff/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    alert("Application submitted successfully");
    form.reset();

  } catch (err) {
    alert("Submit failed Backend is not running.");
    console.error(err);
  }
});
