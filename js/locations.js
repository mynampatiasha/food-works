document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  let brandFilter = params.get("brand") || "";

  // Declared before the picker so that render() — invoked synchronously by
  // picker.set() below — doesn't hit the const temporal dead zone.
  const brandMedia = { veg: "media-veg", nonveg: "media-nonveg", cafe: "media-cafe" };
  const brandIcon = { veg: "🥗", nonveg: "🍗", cafe: "☕" };
  const brandLabel = { veg: "ABRA VEG", nonveg: "ABRA NON-VEG", cafe: "ABRA CAFÉ" };

  const picker = ABRA.initLocationPicker({
    countryId: "f-country", stateId: "f-state", cityId: "f-city",
    onChange: render
  });
  if (params.get("country")) picker.set({ country: params.get("country"), state: params.get("state"), city: params.get("city") });

  document.getElementById("f-brand").value = brandFilter;
  document.getElementById("f-brand").addEventListener("change", (e) => { brandFilter = e.target.value; render(); });
  document.getElementById("f-clear").addEventListener("click", () => {
    document.getElementById("f-country").value = "";
    picker.set({});
    document.getElementById("f-country").dispatchEvent(new Event("change"));
    document.getElementById("f-brand").value = "";
    brandFilter = "";
    render();
  });

  function render() {
    const sel = picker.get();
    let outlets = ABRA.outlets.slice();
    let crumbs = [`<a href="locations.html">All Locations</a>`];

    if (sel.country) {
      const country = ABRA.locations.find(c => c.code === sel.country);
      outlets = outlets.filter(o => o.country === sel.country);
      if (country) crumbs.push(`<span>›</span><span>${country.name}</span>`);
    }
    if (sel.state) {
      const state = ABRA.getStatesForCountry(sel.country).find(s => s.code === sel.state);
      if (state) {
        outlets = outlets.filter(o => o.state === state.name);
        crumbs.push(`<span>›</span><span>${state.name}</span>`);
      }
    }
    if (sel.city) {
      const city = ABRA.getCitiesForState(sel.country, sel.state).find(c => c.code === sel.city);
      if (city) {
        outlets = outlets.filter(o => o.city === city.name);
        crumbs.push(`<span>›</span><span>${city.name}</span>`);
      }
    }
    if (brandFilter) outlets = outlets.filter(o => o.brand === brandFilter);

    document.getElementById("loc-breadcrumb").innerHTML = crumbs.join(" ");
    document.getElementById("result-count").textContent = `${outlets.length} outlet${outlets.length !== 1 ? "s" : ""} found`;

    const grid = document.getElementById("outlet-grid");
    if (!outlets.length) {
      grid.innerHTML = `<p class="hint">No outlets match these filters yet — try a different city or check back as we expand.</p>`;
      return;
    }
    grid.innerHTML = outlets.map(o => `
      <div class="card outlet-card reveal">
        <div class="media ${brandMedia[o.brand]}"><span class="media-icon">${brandIcon[o.brand]}</span></div>
        <div class="card-body">
          <span class="badge badge-${o.brand === 'nonveg' ? 'nonveg' : o.brand}">${brandLabel[o.brand]}</span>
          <h3 style="margin-top:8px;">${o.name}</h3>
          <div class="meta-row">📍 ${o.area}, ${o.city}, ${o.country}</div>
          <div class="meta-row"><span class="stars">★ ${o.rating}</span> (${o.reviews} reviews)</div>
          <div class="meta-row">🕒 ${o.hours}</div>
        </div>
        <div class="card-foot">
          <a href="outlet.html?slug=${o.slug}" class="btn btn-sm btn-outline">View Outlet</a>
          <a href="order.html?outlet=${o.slug}" class="btn btn-sm btn-primary">Order</a>
          <a href="reserve.html?outlet=${o.slug}" class="btn btn-sm btn-outline">Reserve</a>
        </div>
      </div>`).join("");
  }

  render();
});
