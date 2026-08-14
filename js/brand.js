/* Shared renderer for veg.html / non-veg.html / cafe.html
   Reads the brand id from <body data-brand="veg|nonveg|cafe">
   so all three brand pages share one script. */
document.addEventListener("DOMContentLoaded", () => {
  const brandId = document.body.dataset.brand;
  const brand = ABRA.getBrand(brandId);
  if (!brand) return;

  document.title = `${brand.name} — ${brand.tagline} | ABRA FOOD`;

  document.getElementById("brand-eyebrow").textContent = brand.tagline;
  document.getElementById("brand-title").textContent = brand.name;
  document.getElementById("brand-desc").textContent = brand.desc;

  document.getElementById("brand-cuisines").innerHTML = brand.cuisines
    .map(c => `<span class="chip">${c}</span>`).join("");

  document.getElementById("brand-categories").innerHTML = (ABRA.categories[brandId] || [])
    .map(cat => `<a href="menu.html?brand=${brandId}&category=${encodeURIComponent(cat)}" class="chip">${cat}</a>`).join("");

  // Popular dishes for this brand
  const items = ABRA.menu.filter(m => m.brand === brandId);
  const popular = items.filter(m => m.popular).concat(items.filter(m => !m.popular)).slice(0, 6);
  const brandIcon = brand.icon;
  const mediaClass = "media-" + brandId;
  document.getElementById("brand-dishes").innerHTML = popular.map(m => `
    <div class="card reveal">
      <div class="media ${mediaClass}"><span class="media-icon">${brandIcon}</span></div>
      <div class="card-body">
        <h3 style="font-size:1.05rem;display:flex;align-items:center;gap:8px;">
          <span class="dot ${m.veg ? 'dot-veg' : 'dot-nonveg'}"></span>${m.name}
        </h3>
        <p>${m.desc}</p>
      </div>
      <div class="card-foot" style="justify-content:space-between;align-items:center;">
        <strong>₹${m.price}</strong>
        <span class="badge badge-${brandId === 'nonveg' ? 'nonveg' : brandId}">${m.category}</span>
      </div>
    </div>`).join("");

  // Outlets for this brand
  const outlets = ABRA.getOutletsByBrand(brandId);
  document.getElementById("brand-outlets").innerHTML = outlets.map(o => `
    <div class="card outlet-card reveal">
      <div class="media ${mediaClass}"><span class="media-icon">${brandIcon}</span></div>
      <div class="card-body">
        <h3>${o.name}</h3>
        <div class="meta-row">📍 ${o.area}, ${o.city}</div>
        <div class="meta-row"><span class="stars">★ ${o.rating}</span> (${o.reviews} reviews)</div>
      </div>
      <div class="card-foot">
        <a href="outlet.html?slug=${o.slug}" class="btn btn-sm btn-outline">View Outlet</a>
        <a href="order.html?outlet=${o.slug}" class="btn btn-sm btn-${brandId === 'nonveg' ? 'nonveg' : brandId}">Order Now</a>
      </div>
    </div>`).join("");

  // Offers for this brand
  const offers = ABRA.offers.filter(o => o.brand === brandId || o.brand === "all").slice(0, 3);
  document.getElementById("brand-offers").innerHTML = offers.map(o => `
    <div class="card reveal"><div class="card-body">
      <span class="badge badge-gold">${o.tag}</span>
      <h3 style="margin-top:10px;">${o.title}</h3>
      <p>${o.desc}</p>
    </div></div>`).join("") || `<p class="hint">No active offers for this brand right now — check back soon.</p>`;

  // Chefs
  const chefs = ABRA.chefs.filter(c => {
    const o = ABRA.getOutlet(c.outlet);
    return o && o.brand === brandId;
  });
  const chefWrap = document.getElementById("brand-chefs");
  if (chefWrap) {
    chefWrap.innerHTML = chefs.map(c => `
      <div class="card reveal"><div class="card-body text-center">
        <div class="avatar" style="width:64px;height:64px;font-size:1.4rem;margin:0 auto 12px;">${c.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
        <h3 style="font-size:1.05rem;">${c.name}</h3>
        <p class="hint">${c.title} · ${c.exp}</p>
        <p>${c.specialty}</p>
        <p class="hint">Signature: ${c.signature}</p>
      </div></div>`).join("");
  }

  // Location picker scoped to brand
  const picker = ABRA.initLocationPicker({
    countryId: "b-country", stateId: "b-state", cityId: "b-city", outletId: "b-outlet",
    brandFilter: () => brandId
  });
  document.getElementById("b-go").addEventListener("click", () => {
    const sel = picker.get();
    if (sel.outlet) window.location.href = `outlet.html?slug=${sel.outlet}`;
    else ABRA.toast("Please select an outlet first");
  });
});
