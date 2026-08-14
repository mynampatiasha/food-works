document.addEventListener("DOMContentLoaded", () => {
  /* ---------- View switching ---------- */
  const views = ["overview", "outlets", "menu", "offers"];
  function showView(v) {
    views.forEach(name => document.getElementById("view-" + name).style.display = name === v ? "" : "none");
    document.querySelectorAll(".admin-side [data-view]").forEach(b => b.classList.toggle("active", b.dataset.view === v));
    if (v === "overview") renderOverview();
    if (v === "outlets") renderOutletsTable();
    if (v === "menu") renderMenuTable();
    if (v === "offers") renderOffersTable();
  }
  document.querySelectorAll(".admin-side [data-view]").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));

  document.getElementById("reset-data").addEventListener("click", () => {
    if (!confirm("Reset all admin changes back to the default demo data? This cannot be undone.")) return;
    ABRA.store.resetAllOverrides();
    location.reload();
  });

  /* ---------- Overview ---------- */
  function renderOverview() {
    document.getElementById("kpi-outlets").textContent = ABRA.outlets.length;
    document.getElementById("kpi-menu").textContent = ABRA.menu.length;
    document.getElementById("kpi-offers").textContent = ABRA.offers.length;
    document.getElementById("kpi-countries").textContent = new Set(ABRA.outlets.map(o => o.country)).size;
    const byBrand = { veg: 0, nonveg: 0, cafe: 0 };
    ABRA.outlets.forEach(o => byBrand[o.brand]++);
    document.getElementById("brand-breakdown").innerHTML = `
      <div class="badge badge-veg">ABRA VEG: ${byBrand.veg}</div>
      <div class="badge badge-nonveg">ABRA NON-VEG: ${byBrand.nonveg}</div>
      <div class="badge badge-cafe">ABRA CAFÉ: ${byBrand.cafe}</div>`;
  }

  /* ---------- Modal helpers ---------- */
  function openModal(id) { document.getElementById(id).classList.add("open"); }
  function closeModal(id) { document.getElementById(id).classList.remove("open"); }
  document.querySelectorAll("[data-close-modal]").forEach(b => b.addEventListener("click", (e) => {
    closeModal(e.target.closest(".modal-backdrop").id);
  }));
  document.querySelectorAll(".modal-backdrop").forEach(m => m.addEventListener("click", (e) => {
    if (e.target === m) closeModal(m.id);
  }));

  /* ---------- Outlets ---------- */
  function renderOutletsTable() {
    document.getElementById("outlets-table").innerHTML = ABRA.outlets.map(o => `
      <tr>
        <td><strong>${o.name}</strong><br><span class="hint">${o.slug}</span></td>
        <td><span class="badge badge-${o.brand === 'nonveg' ? 'nonveg' : o.brand}">${o.brand}</span></td>
        <td>${o.city}, ${o.country}</td>
        <td>★ ${o.rating}</td>
        <td>${o.services.slice(0,2).join(", ")}${o.services.length>2 ? "…" : ""}</td>
        <td class="table-actions">
          <button data-edit-outlet="${o.slug}">Edit</button>
          <button class="danger" data-del-outlet="${o.slug}">Delete</button>
        </td>
      </tr>`).join("");
    document.querySelectorAll("[data-edit-outlet]").forEach(b => b.addEventListener("click", () => openOutletModal(b.dataset.editOutlet)));
    document.querySelectorAll("[data-del-outlet]").forEach(b => b.addEventListener("click", () => {
      if (!confirm("Delete this outlet?")) return;
      ABRA.store.deleteOutletOverride(b.dataset.delOutlet);
      ABRA.outlets = ABRA.outlets.filter(o => o.slug !== b.dataset.delOutlet);
      renderOutletsTable();
      renderOverview();
    }));
  }

  function fillCountrySelect(el) {
    el.innerHTML = ABRA.locations.map(c => `<option value="${c.code}">${c.name}</option>`).join("");
  }
  function fillStateSelect(el, countryCode) {
    el.innerHTML = ABRA.getStatesForCountry(countryCode).map(s => `<option value="${s.name}">${s.name}</option>`).join("");
  }
  function fillCitySelect(el, countryCode, stateName) {
    const states = ABRA.getStatesForCountry(countryCode);
    const state = states.find(s => s.name === stateName) || states[0];
    el.innerHTML = state ? state.cities.map(c => `<option value="${c.name}" data-code="${c.code}" data-statecode="${state.code}">${c.name}</option>`).join("") : "";
  }

  document.getElementById("mo-country").addEventListener("change", (e) => {
    fillStateSelect(document.getElementById("mo-state"), e.target.value);
    document.getElementById("mo-state").dispatchEvent(new Event("change"));
  });
  document.getElementById("mo-state").addEventListener("change", (e) => {
    fillCitySelect(document.getElementById("mo-city"), document.getElementById("mo-country").value, e.target.value);
  });

  function openOutletModal(slug) {
    fillCountrySelect(document.getElementById("mo-country"));
    document.getElementById("mo-country").dispatchEvent(new Event("change"));

    const outlet = slug ? ABRA.getOutlet(slug) : null;
    document.getElementById("outlet-modal-title").textContent = outlet ? "Edit Outlet" : "Add Outlet";
    document.getElementById("mo-original-slug").value = slug || "";
    document.getElementById("mo-name").value = outlet ? outlet.name : "";
    document.getElementById("mo-brand").value = outlet ? outlet.brand : "veg";
    document.getElementById("mo-area").value = outlet ? outlet.area : "";
    document.getElementById("mo-address").value = outlet ? outlet.address : "";
    document.getElementById("mo-phone").value = outlet ? outlet.phone : "";
    document.getElementById("mo-hours").value = outlet ? outlet.hours : "11:00 AM – 11:00 PM (All days)";
    document.getElementById("mo-rating").value = outlet ? outlet.rating : "4.5";
    document.getElementById("mo-services").value = outlet ? outlet.services.join(", ") : "Dine-in, Delivery, Pickup";
    document.getElementById("mo-facilities").value = outlet ? outlet.facilities.join(", ") : "AC Seating, Parking";
    document.getElementById("mo-parking").value = outlet ? outlet.parking : "";

    if (outlet) {
      document.getElementById("mo-country").value = outlet.country;
      fillStateSelect(document.getElementById("mo-state"), outlet.country);
      document.getElementById("mo-state").value = outlet.state;
      fillCitySelect(document.getElementById("mo-city"), outlet.country, outlet.state);
      document.getElementById("mo-city").value = outlet.city;
    }
    openModal("modal-outlet");
  }
  document.getElementById("add-outlet").addEventListener("click", () => openOutletModal(null));

  document.getElementById("mo-save").addEventListener("click", () => {
    const name = document.getElementById("mo-name").value.trim();
    if (!name) { alert("Outlet name is required"); return; }
    const originalSlug = document.getElementById("mo-original-slug").value;
    const slug = originalSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.floor(Math.random()*900+100);

    const countryEl = document.getElementById("mo-country");
    const stateName = document.getElementById("mo-state").value;
    const cityEl = document.getElementById("mo-city");
    const cityName = cityEl.value;
    const cityOpt = cityEl.selectedOptions[0];
    const countryCode = countryEl.value;
    const stateCode = cityOpt ? cityOpt.dataset.statecode : "";
    const cityCode = cityOpt ? cityOpt.dataset.code : "";

    const outlet = {
      slug, name,
      brand: document.getElementById("mo-brand").value,
      country: countryCode, state: stateName, city: cityName,
      area: document.getElementById("mo-area").value,
      address: document.getElementById("mo-address").value,
      phone: document.getElementById("mo-phone").value,
      hours: document.getElementById("mo-hours").value,
      rating: parseFloat(document.getElementById("mo-rating").value) || 4.5,
      reviews: 0,
      services: document.getElementById("mo-services").value.split(",").map(s => s.trim()).filter(Boolean),
      facilities: document.getElementById("mo-facilities").value.split(",").map(s => s.trim()).filter(Boolean),
      parking: document.getElementById("mo-parking").value
    };

    ABRA.store.upsertOutletOverride(outlet);
    const idx = ABRA.outlets.findIndex(o => o.slug === slug);
    if (idx > -1) ABRA.outlets[idx] = outlet; else ABRA.outlets.push(outlet);

    // Attach to the location tree (in-memory for this session) so pickers site-wide can find it
    const city = ABRA.getCitiesForState(countryCode, stateCode).find(c => c.code === cityCode);
    if (city && !city.outlets.includes(slug)) city.outlets.push(slug);

    closeModal("modal-outlet");
    renderOutletsTable();
    renderOverview();
    ABRA.toast("Outlet saved");
  });

  /* ---------- Menu Items ---------- */
  function renderMenuTable() {
    document.getElementById("menu-table").innerHTML = ABRA.menu.map(m => `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td><span class="badge badge-${m.brand === 'nonveg' ? 'nonveg' : m.brand}">${m.brand}</span></td>
        <td>${m.category}</td>
        <td>₹${m.price}</td>
        <td>${m.veg ? "🟢" : "🔴"}</td>
        <td>${m.outlets === "all" ? "All outlets" : m.outlets.length + " outlet(s)"}</td>
        <td class="table-actions">
          <button data-edit-menu="${m.id}">Edit</button>
          <button class="danger" data-del-menu="${m.id}">Delete</button>
        </td>
      </tr>`).join("");
    document.querySelectorAll("[data-edit-menu]").forEach(b => b.addEventListener("click", () => openMenuModal(b.dataset.editMenu)));
    document.querySelectorAll("[data-del-menu]").forEach(b => b.addEventListener("click", () => {
      if (!confirm("Delete this menu item?")) return;
      ABRA.store.deleteMenuItemOverride(b.dataset.delMenu);
      ABRA.menu = ABRA.menu.filter(m => m.id !== b.dataset.delMenu);
      renderMenuTable();
      renderOverview();
    }));
  }

  function fillCategorySelect(brand, selected) {
    const el = document.getElementById("mm-category");
    el.innerHTML = (ABRA.categories[brand] || []).map(c => `<option value="${c}" ${c===selected?"selected":""}>${c}</option>`).join("");
  }
  document.getElementById("mm-brand").addEventListener("change", (e) => fillCategorySelect(e.target.value));

  function openMenuModal(id) {
    const item = id ? ABRA.menu.find(m => m.id === id) : null;
    document.getElementById("menu-modal-title").textContent = item ? "Edit Menu Item" : "Add Menu Item";
    document.getElementById("mm-original-id").value = id || "";
    document.getElementById("mm-brand").value = item ? item.brand : "veg";
    fillCategorySelect(document.getElementById("mm-brand").value, item ? item.category : null);
    document.getElementById("mm-name").value = item ? item.name : "";
    document.getElementById("mm-desc").value = item ? item.desc : "";
    document.getElementById("mm-price").value = item ? item.price : "";
    document.getElementById("mm-veg").checked = item ? item.veg : true;
    document.getElementById("mm-popular").checked = item ? !!item.popular : false;
    document.getElementById("mm-outlets").value = item ? (item.outlets === "all" ? "all" : item.outlets.join(", ")) : "all";
    openModal("modal-menu");
  }
  document.getElementById("add-menu").addEventListener("click", () => openMenuModal(null));

  document.getElementById("mm-save").addEventListener("click", () => {
    const name = document.getElementById("mm-name").value.trim();
    const price = parseFloat(document.getElementById("mm-price").value);
    if (!name || isNaN(price)) { alert("Name and price are required"); return; }
    const originalId = document.getElementById("mm-original-id").value;
    const id = originalId || "m" + Date.now();
    const outletsRaw = document.getElementById("mm-outlets").value.trim();
    const item = {
      id, name,
      brand: document.getElementById("mm-brand").value,
      category: document.getElementById("mm-category").value,
      desc: document.getElementById("mm-desc").value,
      price,
      veg: document.getElementById("mm-veg").checked,
      popular: document.getElementById("mm-popular").checked,
      outlets: (!outletsRaw || outletsRaw.toLowerCase() === "all") ? "all" : outletsRaw.split(",").map(s => s.trim()).filter(Boolean)
    };
    ABRA.store.upsertMenuItemOverride(item);
    const idx = ABRA.menu.findIndex(m => m.id === id);
    if (idx > -1) ABRA.menu[idx] = item; else ABRA.menu.push(item);
    closeModal("modal-menu");
    renderMenuTable();
    renderOverview();
    ABRA.toast("Menu item saved");
  });

  /* ---------- Offers ---------- */
  function renderOffersTable() {
    document.getElementById("offers-table").innerHTML = ABRA.offers.map(o => `
      <tr>
        <td><strong>${o.title}</strong></td>
        <td><span class="badge badge-gold">${o.brand}</span></td>
        <td>${o.outlet === "all" ? "All outlets" : (ABRA.getOutlet(o.outlet) || {}).name || o.outlet}</td>
        <td>${new Date(o.validTill).toLocaleDateString()}</td>
        <td class="table-actions">
          <button data-edit-offer="${o.id}">Edit</button>
          <button class="danger" data-del-offer="${o.id}">Delete</button>
        </td>
      </tr>`).join("");
    document.querySelectorAll("[data-edit-offer]").forEach(b => b.addEventListener("click", () => openOfferModal(b.dataset.editOffer)));
    document.querySelectorAll("[data-del-offer]").forEach(b => b.addEventListener("click", () => {
      if (!confirm("Delete this offer?")) return;
      ABRA.store.deleteOfferOverride(b.dataset.delOffer);
      ABRA.offers = ABRA.offers.filter(o => o.id !== b.dataset.delOffer);
      renderOffersTable();
      renderOverview();
    }));
  }

  function fillOutletSelect(selected) {
    const el = document.getElementById("mf-outlet");
    el.innerHTML = `<option value="all">All Outlets</option>` +
      ABRA.outlets.map(o => `<option value="${o.slug}" ${o.slug===selected?"selected":""}>${o.name}</option>`).join("");
  }

  function openOfferModal(id) {
    const offer = id ? ABRA.offers.find(o => o.id === id) : null;
    document.getElementById("offer-modal-title").textContent = offer ? "Edit Offer" : "Add Offer";
    document.getElementById("mf-original-id").value = id || "";
    document.getElementById("mf-title").value = offer ? offer.title : "";
    document.getElementById("mf-desc").value = offer ? offer.desc : "";
    document.getElementById("mf-tag").value = offer ? offer.tag : "";
    document.getElementById("mf-brand").value = offer ? offer.brand : "all";
    fillOutletSelect(offer ? offer.outlet : "all");
    document.getElementById("mf-validtill").value = offer ? offer.validTill : new Date().toISOString().split("T")[0];
    openModal("modal-offer");
  }
  document.getElementById("add-offer").addEventListener("click", () => openOfferModal(null));

  document.getElementById("mf-save").addEventListener("click", () => {
    const title = document.getElementById("mf-title").value.trim();
    if (!title) { alert("Offer title is required"); return; }
    const originalId = document.getElementById("mf-original-id").value;
    const id = originalId || "o" + Date.now();
    const offer = {
      id, title,
      desc: document.getElementById("mf-desc").value,
      tag: document.getElementById("mf-tag").value || "Special Offer",
      brand: document.getElementById("mf-brand").value,
      outlet: document.getElementById("mf-outlet").value,
      validTill: document.getElementById("mf-validtill").value
    };
    ABRA.store.upsertOfferOverride(offer);
    const idx = ABRA.offers.findIndex(o => o.id === id);
    if (idx > -1) ABRA.offers[idx] = offer; else ABRA.offers.push(offer);
    closeModal("modal-offer");
    renderOffersTable();
    renderOverview();
    ABRA.toast("Offer saved");
  });

  showView("overview");
});
