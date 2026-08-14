document.addEventListener("DOMContentLoaded", () => {
  const picker = ABRA.initLocationPicker({
    countryId: "f-country", stateId: "f-state", cityId: "f-city", outletId: "f-outlet"
  });

  document.getElementById("f-go").addEventListener("click", () => {
    const sel = picker.get();
    if (sel.outlet) {
      ABRA.store.setLocation(sel);
      window.location.href = `outlet.html?slug=${sel.outlet}`;
    } else if (sel.city) {
      window.location.href = `locations.html?country=${sel.country}&state=${sel.state}&city=${sel.city}`;
    } else {
      window.location.href = "locations.html";
    }
  });

  // Stats
  document.getElementById("stat-outlets").textContent = ABRA.outlets.length + "+";
  const cities = new Set(ABRA.outlets.map(o => o.city));
  document.getElementById("stat-cities").textContent = cities.size;
  const countries = new Set(ABRA.outlets.map(o => o.country));
  document.getElementById("stat-countries").textContent = countries.size;

  // Offers preview (first 3)
  const brandClass = { veg: "media-veg", nonveg: "media-nonveg", cafe: "media-cafe", all: "media-gold" };
  const brandIcon = { veg: "🥗", nonveg: "🍗", cafe: "☕", all: "⭐" };
  const offersHtml = ABRA.offers.slice(0, 3).map(o => `
    <div class="card reveal">
      <div class="media ${brandClass[o.brand]}"><span class="media-icon">${brandIcon[o.brand]}</span></div>
      <div class="card-body">
        <span class="badge badge-gold">${o.tag}</span>
        <h3 style="margin-top:10px;">${o.title}</h3>
        <p>${o.desc}</p>
      </div>
      <div class="card-foot"><a href="offers.html" class="btn btn-outline btn-sm">View Offer</a></div>
    </div>`).join("");
  document.getElementById("offers-preview").innerHTML = offersHtml;

  // Popular dishes — one from each brand first, so the homepage represents all three
  const popularByBrand = ["veg", "nonveg", "cafe"].map(b => ABRA.menu.find(m => m.brand === b && m.popular));
  const morePopular = ABRA.menu.filter(m => m.popular && !popularByBrand.includes(m));
  const popular = popularByBrand.concat(morePopular).filter(Boolean).slice(0, 4);
  document.getElementById("popular-dishes").innerHTML = popular.map(m => `
    <div class="card reveal">
      <div class="media ${brandClass[m.brand]}"><span class="media-icon">${brandIcon[m.brand]}</span></div>
      <div class="card-body">
        <h3 style="font-size:1.05rem;display:flex;align-items:center;gap:8px;">
          <span class="dot ${m.veg ? 'dot-veg' : 'dot-nonveg'}"></span>${m.name}
        </h3>
        <p>${m.desc}</p>
      </div>
      <div class="card-foot" style="justify-content:space-between;align-items:center;">
        <strong>₹${m.price}</strong>
        <a href="menu.html?brand=${m.brand}" class="btn btn-sm btn-outline">View</a>
      </div>
    </div>`).join("");

  // Testimonials
  document.getElementById("testimonials").innerHTML = ABRA.reviews.map(r => {
    const outlet = ABRA.getOutlet(r.outlet);
    return `<div class="quote-card reveal">
      <span class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
      <p>“${r.text}”</p>
      <div class="who">
        <div class="avatar">${r.name.charAt(0)}</div>
        <div><strong style="display:block;font-size:.9rem;">${r.name}</strong><span class="hint">${outlet ? outlet.name : ""}</span></div>
      </div>
    </div>`;
  }).join("");
});
