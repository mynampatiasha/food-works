document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const state = {
    brand: params.get("brand") || "all",
    category: params.get("category") || "all",
    vegOnly: false,
    q: params.get("q") || ""
  };

  const savedLoc = ABRA.store.getLocation();
  let currentOutlet = params.get("outlet") || (savedLoc && savedLoc.outlet) || null;

  const picker = ABRA.initLocationPicker({
    countryId: "f-country", stateId: "f-state", cityId: "f-city", outletId: "f-outlet"
  });
  if (savedLoc) picker.set(savedLoc);
  else if (currentOutlet) picker.set(ABRA.findLocationCodesForOutlet(currentOutlet));

  function updateLocationStatus() {
    const el = document.getElementById("location-status");
    const outlet = currentOutlet ? ABRA.getOutlet(currentOutlet) : null;
    el.textContent = outlet
      ? `Showing menu & prices for ${outlet.name}. Add items to order from here.`
      : "No outlet selected — showing the standard ABRA catalogue. Select an outlet to order.";
  }

  document.getElementById("f-set").addEventListener("click", () => {
    const sel = picker.get();
    if (!sel.outlet) { ABRA.toast("Please select an outlet"); return; }
    currentOutlet = sel.outlet;
    ABRA.store.setLocation(sel);
    updateLocationStatus();
    render();
    ABRA.toast("Outlet set: " + ABRA.getOutlet(currentOutlet).name);
  });

  function setBrandChips() {
    document.querySelectorAll("[data-brand]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.brand === state.brand);
      btn.addEventListener("click", () => {
        state.brand = btn.dataset.brand;
        state.category = "all";
        setBrandChips();
        renderCategoryPills();
        render();
      });
    });
  }

  function renderCategoryPills() {
    let cats = [];
    if (state.brand === "all") {
      cats = Array.from(new Set(Object.values(ABRA.categories).flat()));
    } else {
      cats = ABRA.categories[state.brand] || [];
    }
    const wrap = document.getElementById("category-pills");
    wrap.innerHTML = `<a href="#" data-cat="all" class="${state.category==='all'?'active':''}">All Categories</a>` +
      cats.map(c => `<a href="#" data-cat="${c}" class="${state.category===c?'active':''}">${c}</a>`).join("");
    wrap.querySelectorAll("a").forEach(a => a.addEventListener("click", (e) => {
      e.preventDefault();
      state.category = a.dataset.cat;
      renderCategoryPills();
      render();
    }));
  }

  document.getElementById("veg-only-toggle").addEventListener("click", (e) => {
    state.vegOnly = !state.vegOnly;
    e.target.classList.toggle("active", state.vegOnly);
    render();
  });
  document.getElementById("menu-search").addEventListener("input", (e) => {
    state.q = e.target.value;
    render();
  });
  if (state.q) document.getElementById("menu-search").value = state.q;

  const brandMedia = { veg: "media-veg", nonveg: "media-nonveg", cafe: "media-cafe" };
  const brandIcon = { veg: "🥗", nonveg: "🍗", cafe: "☕" };

  function getBaseItems() {
    if (currentOutlet) return ABRA.getMenuForOutlet(currentOutlet);
    return ABRA.menu;
  }

  function render() {
    let items = getBaseItems();
    if (state.brand !== "all") items = items.filter(m => m.brand === state.brand);
    if (state.category !== "all") items = items.filter(m => m.category === state.category);
    if (state.vegOnly) items = items.filter(m => m.veg);
    if (state.q) {
      const q = state.q.toLowerCase();
      items = items.filter(m => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
    }

    const byCategory = {};
    items.forEach(m => { (byCategory[m.category] = byCategory[m.category] || []).push(m); });

    const results = document.getElementById("menu-results");
    if (!items.length) {
      results.innerHTML = `<div class="text-center" style="padding:60px 0;color:var(--ink-soft);">
        <div style="font-size:2.4rem;margin-bottom:10px;">🍽️</div>
        <p>No dishes match your filters. Try a different category or search term.</p>
      </div>`;
      return;
    }

    results.innerHTML = Object.keys(byCategory).map(cat => `
      <h3 style="margin:36px 0 16px;">${cat}</h3>
      <div class="grid grid-2" style="gap:14px;">
        ${byCategory[cat].map(m => `
        <div class="menu-item">
          <div class="thumb ${brandMedia[m.brand]}">${brandIcon[m.brand]}</div>
          <div class="info">
            <h4><span class="dot ${m.veg ? 'dot-veg' : 'dot-nonveg'}"></span>${m.name}</h4>
            <p>${m.desc}</p>
            <div class="price-row">
              <span class="price">₹${m.price}</span>
              ${currentOutlet
                ? `<button class="add-btn" data-add="${m.id}">Add +</button>`
                : `<button class="add-btn" data-need-outlet="1" style="opacity:.55;">Select Outlet</button>`}
            </div>
          </div>
        </div>`).join("")}
      </div>`).join("");

    results.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => {
      const item = ABRA.menu.find(m => m.id === btn.dataset.add);
      ABRA.store.addToCart(currentOutlet, item, 1);
      ABRA.toast(`${item.name} added to cart`);
    }));
    results.querySelectorAll("[data-need-outlet]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelector(".finder").scrollIntoView({ behavior: "smooth", block: "center" });
      ABRA.toast("Please select an outlet first");
    }));
  }

  updateLocationStatus();
  setBrandChips();
  renderCategoryPills();
  render();
});
