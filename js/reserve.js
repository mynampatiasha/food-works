document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const picker = ABRA.initLocationPicker({
    countryId: "r-country", stateId: "r-state", cityId: "r-city", outletId: "r-outlet"
  });

  const presetOutlet = params.get("outlet");
  if (presetOutlet) {
    const codes = ABRA.findLocationCodesForOutlet(presetOutlet);
    if (codes) picker.set(codes);
  } else {
    const saved = ABRA.store.getLocation();
    if (saved) picker.set(saved);
  }

  // Set min date to today
  const dateInput = document.getElementById("r-date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
  dateInput.value = today;

  document.getElementById("r-submit").addEventListener("click", () => {
    const sel = picker.get();
    const name = document.getElementById("r-name").value.trim();
    const phone = document.getElementById("r-phone").value.trim();
    const date = document.getElementById("r-date").value;
    const time = document.getElementById("r-time").value;
    const guests = document.getElementById("r-guests").value;

    const errEl = document.getElementById("r-success");
    if (!sel.outlet) return showError(errEl, "Please select an outlet.");
    if (!name || !phone) return showError(errEl, "Please enter your name and phone number.");
    if (!date) return showError(errEl, "Please choose a date.");

    const outlet = ABRA.getOutlet(sel.outlet);
    const bookingRef = "RSV" + Math.floor(10000 + Math.random() * 89999);

    document.getElementById("reserve-form-wrap").style.display = "none";
    document.getElementById("reserve-confirmed").style.display = "";
    document.getElementById("confirm-detail").innerHTML =
      `Booking Ref <strong>#${bookingRef}</strong><br>
       <strong>${outlet.name}</strong><br>
       ${new Date(date).toDateString()} at ${time} · ${guests} guest${guests > 1 ? "s" : ""}<br>
       Reserved for ${name}`;
  });

  function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove("alert-success");
    el.classList.add("alert-error", "show");
    setTimeout(() => el.classList.remove("show"), 3500);
  }
});
