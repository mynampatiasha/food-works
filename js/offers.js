document.addEventListener("DOMContentLoaded", () => {
  const picker = ABRA.initLocationPicker({
    countryId: "f-country", stateId: "f-state", cityId: "f-city", onChange: render
  });
  document.getElementById("f-brand").addEventListener("change", render);
  document.getElementById("f-reset").addEventListener("click", () => {
    picker.set({});
    document.getElementById("f-country").value = "";
    document.getElementById("f-country").dispatchEvent(new Event("change"));
    document.getElementById("f-brand").value = "";
    render();
  });

  const brandMedia = { veg: "media-veg", nonveg: "media-nonveg", cafe: "media-cafe", all: "media-gold" };
  const brandIcon = { veg: "🥗", nonveg: "🍗", cafe: "☕", all: "⭐" };

  function render() {
    const sel = picker.get();
    const brand = document.getElementById("f-brand").value;

    let offers = ABRA.offers.filter(o => {
      if (brand && o.brand !== brand && o.brand !== "all") return false;
      if (!sel.city && !sel.state && !sel.country) return true;
      if (o.outlet === "all") return true;
      const outlet = ABRA.getOutlet(o.outlet);
      if (!outlet) return false;
      if (sel.country && outlet.country !== sel.country) return false;
      if (sel.state) {
        const st = ABRA.getStatesForCountry(sel.country).find(s => s.code === sel.state);
        if (st && outlet.state !== st.name) return false;
      }
      if (sel.city) {
        const city = ABRA.getCitiesForState(sel.country, sel.state).find(c => c.code === sel.city);
        if (city && outlet.city !== city.name) return false;
      }
      return true;
    });

    document.getElementById("offers-count").textContent = `${offers.length} offer${offers.length !== 1 ? "s" : ""} available`;
    document.getElementById("offers-grid").innerHTML = offers.length ? offers.map(o => {
      const outlet = o.outlet !== "all" ? ABRA.getOutlet(o.outlet) : null;
      return `
      <div class="card reveal">
        <div class="media ${brandMedia[o.brand]}"><span class="media-icon">${brandIcon[o.brand]}</span></div>
        <div class="card-body">
          <span class="badge badge-gold">${o.tag}</span>
          <h3 style="margin-top:10px;">${o.title}</h3>
          <p>${o.desc}</p>
          <p class="hint">${outlet ? "📍 " + outlet.name : "🌍 All ABRA Outlets"} · Valid till ${new Date(o.validTill).toLocaleDateString()}</p>
        </div>
        <div class="card-foot">
          ${outlet ? `<a href="outlet.html?slug=${outlet.slug}" class="btn btn-sm btn-outline">View Outlet</a>` : `<a href="locations.html" class="btn btn-sm btn-outline">Find Outlets</a>`}
        </div>
      </div>`;
    }).join("") : `<p class="hint">No offers match these filters right now — check back soon.</p>`;
  }

  render();
});
