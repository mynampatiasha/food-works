document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("c-date").min = today;
  document.getElementById("c-date").value = today;

  document.getElementById("c-submit").addEventListener("click", () => {
    const location = document.getElementById("c-location").value.trim();
    const name = document.getElementById("c-name").value.trim();
    const phone = document.getElementById("c-phone").value.trim();
    const errEl = document.getElementById("c-error");

    if (!location) return showError(errEl, "Please enter the event location.");
    if (!name || !phone) return showError(errEl, "Please enter your name and phone number.");

    const guests = document.getElementById("c-guests").value;
    const date = document.getElementById("c-date").value;
    const pref = document.getElementById("c-pref").value;
    const ref = "CAT" + Math.floor(10000 + Math.random() * 89999);

    document.getElementById("catering-form-wrap").style.display = "none";
    document.getElementById("catering-confirmed").style.display = "";
    document.getElementById("c-confirm-detail").innerHTML =
      `Reference <strong>#${ref}</strong><br>
       ${pref} catering for ${guests} guests at ${location}<br>
       ${new Date(date).toDateString()}`;
  });

  function showError(el, msg) {
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 3500);
  }
});
