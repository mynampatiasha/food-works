document.addEventListener("DOMContentLoaded", () => {
  const picker = ABRA.initLocationPicker({
    countryId: "e-country", stateId: "e-state", cityId: "e-city", outletId: "e-outlet"
  });
  const saved = ABRA.store.getLocation();
  if (saved) picker.set(saved);

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("e-date").min = today;
  document.getElementById("e-date").value = today;

  const packages = [
    { id: "essential", name: "Essential", price: "₹499 / guest", desc: "Set menu, standard seating & basic decor." },
    { id: "premium", name: "Premium", price: "₹899 / guest", desc: "Curated menu, themed decor & dedicated host." },
    { id: "luxe", name: "ABRA Luxe", price: "₹1499 / guest", desc: "Chef's tasting menu, premium decor & live counters." },
  ];
  let selectedPackage = "premium";
  function renderPackages() {
    document.getElementById("e-packages").innerHTML = packages.map(p => `
      <div class="card" data-pkg="${p.id}" style="cursor:pointer;padding:16px;border-color:${selectedPackage===p.id?'var(--gold)':''};">
        <div class="card-body" style="padding:0;">
          <h3 style="font-size:1rem;">${p.name}</h3>
          <p class="hint">${p.price}</p>
          <p>${p.desc}</p>
        </div>
      </div>`).join("");
    document.querySelectorAll("[data-pkg]").forEach(el => el.addEventListener("click", () => {
      selectedPackage = el.dataset.pkg;
      renderPackages();
    }));
  }
  renderPackages();

  document.getElementById("e-submit").addEventListener("click", () => {
    const sel = picker.get();
    const name = document.getElementById("e-name").value.trim();
    const phone = document.getElementById("e-phone").value.trim();
    const errEl = document.getElementById("e-error");

    if (!sel.outlet) return showError(errEl, "Please select an outlet.");
    if (!name || !phone) return showError(errEl, "Please enter your name and phone number.");

    const outlet = ABRA.getOutlet(sel.outlet);
    const type = document.getElementById("e-type").value;
    const guests = document.getElementById("e-guests").value;
    const date = document.getElementById("e-date").value;
    const ref = "EVT" + Math.floor(10000 + Math.random() * 89999);

    document.getElementById("event-form-wrap").style.display = "none";
    document.getElementById("event-confirmed").style.display = "";
    document.getElementById("e-confirm-detail").innerHTML =
      `Reference <strong>#${ref}</strong><br>
       ${type} for ${guests} guests at <strong>${outlet.name}</strong><br>
       ${new Date(date).toDateString()} · ${packages.find(p=>p.id===selectedPackage).name} Package`;
  });

  function showError(el, msg) {
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 3500);
  }
});
