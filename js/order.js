document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const STEP_LABELS = ["Location & Brand", "Delivery/Pickup", "Menu", "Checkout", "Confirmation"];
  let step = 1;

  const savedLoc = ABRA.store.getLocation();
  const state = {
    country: (savedLoc && savedLoc.country) || "",
    stateCode: (savedLoc && savedLoc.state) || "",
    city: (savedLoc && savedLoc.city) || "",
    brand: params.get("brand") || "",
    outlet: params.get("outlet") || (savedLoc && savedLoc.outlet) || "",
    mode: "",
    category: "all",
    q: ""
  };

  // If an outlet is preselected via query/localStorage, derive its location + brand
  if (state.outlet) {
    const o = ABRA.getOutlet(state.outlet);
    if (o) {
      const codes = ABRA.findLocationCodesForOutlet(state.outlet);
      if (codes) { state.country = codes.country; state.stateCode = codes.state; state.city = codes.city; }
      state.brand = o.brand;
    }
  }

  function renderSteps() {
    document.getElementById("steps").innerHTML = STEP_LABELS.map((label, i) => {
      const n = i + 1;
      const cls = n === step ? "active" : n < step ? "done" : "";
      return `<div class="step ${cls}"><span class="num">${n < step ? "✓" : n}</span>${label}</div>`;
    }).join("");
  }

  function goStep(n) {
    step = n;
    for (let i = 1; i <= 5; i++) document.getElementById("panel-" + i).style.display = i === n ? "" : "none";
    renderSteps();
    window.scrollTo({ top: document.getElementById("steps").offsetTop - 100, behavior: "smooth" });
  }
  document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => goStep(parseInt(b.dataset.back))));

  /* ---------------- STEP 1: Location + Brand ---------------- */
  // While true, a prefilled outlet (from ?outlet= or a saved location) survives
  // the cascading picker's own change events instead of being reset to "".
  let initializing = true;

  const picker = ABRA.initLocationPicker({
    countryId: "o-country", stateId: "o-state", cityId: "o-city",
    onChange: () => { if (!initializing) state.outlet = ""; renderOutletList(); }
  });
  picker.set({ country: state.country, state: state.stateCode, city: state.city });

  function setBrand(brand) {
    state.brand = brand;
    if (!initializing) state.outlet = "";
    document.querySelectorAll("#o-brand-chips .chip").forEach(c => c.classList.toggle("active", c.dataset.brand === brand));
    renderOutletList();
  }
  document.querySelectorAll("#o-brand-chips .chip").forEach(c => c.addEventListener("click", () => setBrand(c.dataset.brand)));
  if (state.brand) setBrand(state.brand);
  initializing = false;
  renderOutletList();

  function renderOutletList() {
    const sel = picker.get();
    const wrap = document.getElementById("o-outlet-list");
    if (!sel.city || !state.brand) {
      wrap.innerHTML = `<p class="hint">Select a city and a brand to see available outlets.</p>`;
      document.getElementById("to-step-2").disabled = true;
      return;
    }
    let outlets = ABRA.getOutletsForCity(sel.country, sel.state, sel.city).filter(o => o.brand === state.brand);
    if (!outlets.length) {
      wrap.innerHTML = `<p class="hint">No ${state.brand === "veg" ? "ABRA VEG" : state.brand === "nonveg" ? "ABRA NON-VEG" : "ABRA CAFÉ"} outlets in this city yet.</p>`;
      document.getElementById("to-step-2").disabled = true;
      return;
    }
    wrap.innerHTML = outlets.map(o => `
      <div class="card outlet-pick ${state.outlet === o.slug ? "active" : ""}" data-slug="${o.slug}" style="cursor:pointer;border-color:${state.outlet === o.slug ? "var(--gold)" : ""};">
        <div class="card-body">
          <h3 style="font-size:1rem;">${o.name}</h3>
          <div class="meta-row">📍 ${o.area}</div>
          <div class="meta-row"><span class="stars">★ ${o.rating}</span></div>
        </div>
      </div>`).join("");
    wrap.querySelectorAll("[data-slug]").forEach(el => el.addEventListener("click", () => {
      state.outlet = el.dataset.slug;
      ABRA.store.setLocation({ ...sel, outlet: state.outlet });
      renderOutletList();
      document.getElementById("to-step-2").disabled = false;
    }));
    document.getElementById("to-step-2").disabled = !state.outlet;
  }
  renderOutletList();

  document.getElementById("to-step-2").addEventListener("click", () => goStep(2));

  /* ---------------- STEP 2: Mode ---------------- */
  function setMode(mode) {
    state.mode = mode;
    document.getElementById("mode-delivery").style.borderColor = mode === "delivery" ? "var(--gold)" : "";
    document.getElementById("mode-pickup").style.borderColor = mode === "pickup" ? "var(--gold)" : "";
    document.getElementById("to-step-3").disabled = false;
  }
  document.getElementById("mode-delivery").addEventListener("click", () => setMode("delivery"));
  document.getElementById("mode-pickup").addEventListener("click", () => setMode("pickup"));
  document.getElementById("to-step-3").addEventListener("click", () => { renderMenuStep(); goStep(3); });

  /* ---------------- STEP 3: Menu ---------------- */
  const brandMedia = { veg: "media-veg", nonveg: "media-nonveg", cafe: "media-cafe" };
  const brandIcon = { veg: "🥗", nonveg: "🍗", cafe: "☕" };

  function renderMenuStep() {
    const outlet = ABRA.getOutlet(state.outlet);
    document.getElementById("ordering-from").textContent = `Ordering from ${outlet.name} · ${state.mode === "pickup" ? "Self Pickup" : "Delivery"}`;
    const cats = ABRA.categories[outlet.brand] || [];
    document.getElementById("o-category-pills").innerHTML = `<a href="#" data-cat="all" class="active">All</a>` +
      cats.map(c => `<a href="#" data-cat="${c}">${c}</a>`).join("");
    document.getElementById("o-category-pills").querySelectorAll("a").forEach(a => a.addEventListener("click", (e) => {
      e.preventDefault();
      state.category = a.dataset.cat;
      document.querySelectorAll("#o-category-pills a").forEach(x => x.classList.remove("active"));
      a.classList.add("active");
      renderMenuItems();
    }));
    document.getElementById("o-search").addEventListener("input", (e) => { state.q = e.target.value; renderMenuItems(); });
    renderMenuItems();
  }

  function renderMenuItems() {
    const outlet = ABRA.getOutlet(state.outlet);
    let items = ABRA.getMenuForOutlet(state.outlet);
    if (state.category !== "all") items = items.filter(m => m.category === state.category);
    if (state.q) {
      const q = state.q.toLowerCase();
      items = items.filter(m => m.name.toLowerCase().includes(q));
    }
    const cart = ABRA.store.getCart();
    document.getElementById("o-menu-results").innerHTML = `<div class="grid grid-2" style="gap:14px;margin-top:16px;">` +
      items.map(m => {
        const line = cart.lines.find(l => l.id === m.id);
        const qty = line ? line.qty : 0;
        return `
        <div class="menu-item">
          <div class="thumb ${brandMedia[outlet.brand]}">${brandIcon[outlet.brand]}</div>
          <div class="info">
            <h4><span class="dot ${m.veg ? 'dot-veg' : 'dot-nonveg'}"></span>${m.name}</h4>
            <p>${m.desc}</p>
            <div class="price-row">
              <span class="price">₹${m.price}</span>
              ${qty > 0
                ? `<div class="qty-add"><button data-decr="${m.id}">−</button><span>${qty}</span><button data-incr="${m.id}">+</button></div>`
                : `<button class="add-btn" data-add="${m.id}">Add +</button>`}
            </div>
          </div>
        </div>`;
      }).join("") + `</div>`;

    document.getElementById("o-menu-results").querySelectorAll("[data-add]").forEach(b => b.addEventListener("click", () => {
      const item = ABRA.menu.find(m => m.id === b.dataset.add);
      ABRA.store.addToCart(state.outlet, item, 1);
      renderMenuItems();
    }));
    document.getElementById("o-menu-results").querySelectorAll("[data-incr]").forEach(b => b.addEventListener("click", () => {
      const c = ABRA.store.getCart();
      const l = c.lines.find(x => x.id === b.dataset.incr);
      ABRA.store.setQty(b.dataset.incr, l.qty + 1);
      renderMenuItems();
    }));
    document.getElementById("o-menu-results").querySelectorAll("[data-decr]").forEach(b => b.addEventListener("click", () => {
      const c = ABRA.store.getCart();
      const l = c.lines.find(x => x.id === b.dataset.decr);
      ABRA.store.setQty(b.dataset.decr, l.qty - 1);
      renderMenuItems();
    }));
  }

  document.getElementById("to-step-4").addEventListener("click", () => {
    const cart = ABRA.store.getCart();
    if (!cart.lines.length) { ABRA.toast("Please add at least one item to your order"); return; }
    renderCheckout();
    goStep(4);
  });

  /* ---------------- STEP 4: Checkout ---------------- */
  function renderCheckout() {
    const isDelivery = state.mode === "delivery";
    document.getElementById("checkout-heading").textContent = isDelivery ? "4. Delivery Address & Payment" : "4. Pickup Details & Payment";
    document.getElementById("address-block").style.display = isDelivery ? "" : "none";
    if (!isDelivery) {
      const outlet = ABRA.getOutlet(state.outlet);
      const note = document.getElementById("pickup-note") || document.createElement("div");
      note.id = "pickup-note";
      note.className = "alert alert-success show";
      note.innerHTML = `Pickup from <strong>${outlet.name}</strong><br>${outlet.address}<br>${outlet.hours}`;
      document.getElementById("address-block").insertAdjacentElement("afterend", note);
    } else {
      const existing = document.getElementById("pickup-note");
      if (existing) existing.remove();
    }
    renderSummary();
  }

  function renderSummary() {
    const cart = ABRA.store.getCart();
    const subtotal = ABRA.store.cartTotal();
    const delivery = state.mode === "delivery" ? (subtotal > 499 ? 0 : 40) : 0;
    document.getElementById("order-summary").innerHTML = cart.lines.map(l => `
      <div class="summary-row"><span>${l.name} × ${l.qty}</span><span>₹${l.qty * l.price}</span></div>`).join("") +
      `<div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>` +
      `<div class="summary-row"><span>${state.mode === "delivery" ? "Delivery Fee" : "Pickup Fee"}</span><span>${delivery === 0 ? "Free" : "₹" + delivery}</span></div>` +
      `<div class="summary-row total"><span>Total</span><span>₹${subtotal + delivery}</span></div>`;
  }

  document.getElementById("place-order").addEventListener("click", () => {
    if (state.mode === "delivery") {
      const name = document.getElementById("addr-name").value.trim();
      const phone = document.getElementById("addr-phone").value.trim();
      const line = document.getElementById("addr-line").value.trim();
      if (!name || !phone || !line) { ABRA.toast("Please fill in your delivery address"); return; }
    }
    const outlet = ABRA.getOutlet(state.outlet);
    const orderNo = "ABRA" + Math.floor(100000 + Math.random() * 899999);
    const payment = document.querySelector('input[name="pay"]:checked').value;
    document.getElementById("confirm-text").innerHTML =
      `Your order <strong>#${orderNo}</strong> from <strong>${outlet.name}</strong> has been placed.<br>
       ${state.mode === "delivery" ? "It will be delivered to your address shortly." : "It will be ready for pickup shortly."}
       Payment: ${payment === "cod" ? "Cash / Card on Delivery" : "Paid Online"}.`;
    document.getElementById("track-steps").innerHTML = `
      <div class="step done"><span class="num">✓</span>Order Placed</div>
      <div class="step"><span class="num">2</span>Preparing</div>
      <div class="step"><span class="num">3</span>${state.mode === "delivery" ? "Out for Delivery" : "Ready for Pickup"}</div>
      <div class="step"><span class="num">4</span>${state.mode === "delivery" ? "Delivered" : "Picked Up"}</div>`;
    ABRA.store.clearCart();
    goStep(5);
  });

  goStep(1);
});
