document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const outlet = ABRA.getOutlet(slug);
  const main = document.querySelector("main");

  if (!outlet) {
    main.innerHTML = `<div class="container text-center" style="padding:100px 0;">
      <h1>Outlet Not Found</h1>
      <p class="hint">This outlet may have closed or the link is incorrect.</p>
      <a href="locations.html" class="btn btn-primary">Browse All Locations</a>
    </div>`;
    return;
  }

  const brandInfo = ABRA.getBrand(outlet.brand);
  const heroClass = { veg: "media-veg", nonveg: "media-nonveg", cafe: "media-cafe" }[outlet.brand];
  const brandLabel = { veg: "ABRA VEG", nonveg: "ABRA NON-VEG", cafe: "ABRA CAFÉ" }[outlet.brand];
  const brandBtn = outlet.brand === "nonveg" ? "btn-nonveg" : `btn-${outlet.brand}`;

  document.title = `${outlet.name} — ABRA FOOD`;
  document.getElementById("page-title").textContent = `${outlet.name} — ABRA FOOD`;

  document.getElementById("breadcrumb").innerHTML =
    `<a href="index.html">Home</a><span>›</span><a href="locations.html">Locations</a><span>›</span>
     <a href="locations.html?country=${outlet.country}">${outlet.country}</a><span>›</span>
     <span>${outlet.city}</span><span>›</span><span>${outlet.name}</span>`;

  const hero = document.getElementById("outlet-hero");
  hero.classList.add(heroClass);
  document.getElementById("outlet-brand-badge").textContent = brandLabel;
  document.getElementById("outlet-name").textContent = outlet.name;
  document.getElementById("outlet-rating").innerHTML = `★ ${outlet.rating} · ${outlet.reviews} reviews · ${outlet.area}`;

  document.getElementById("outlet-address").textContent = outlet.address;
  document.getElementById("outlet-phone").textContent = outlet.phone;
  document.getElementById("outlet-hours").textContent = outlet.hours;
  document.getElementById("outlet-parking").textContent = outlet.parking;
  document.getElementById("outlet-glance-rating").textContent = `${outlet.rating} / 5 (${outlet.reviews} reviews)`;

  document.getElementById("outlet-services").innerHTML = outlet.services.map(s => `<span class="chip active">${s}</span>`).join("");
  document.getElementById("outlet-facilities").innerHTML = outlet.facilities.map(f => `<span class="chip">${f}</span>`).join("");

  document.getElementById("outlet-map").innerHTML = `🗺️ ${outlet.address}<br><span class="hint">(Map preview — connect Google Maps API here)</span>`;

  document.getElementById("order-link").href = `order.html?outlet=${outlet.slug}`;
  document.getElementById("reserve-link").href = `reserve.html?outlet=${outlet.slug}`;
  document.getElementById("full-menu-link").href = `menu.html?outlet=${outlet.slug}`;

  // Menu preview
  const brandMedia = heroClass;
  const menuItems = ABRA.getMenuForOutlet(outlet.slug).slice(0, 6);
  document.getElementById("outlet-menu-preview").innerHTML = menuItems.map(m => `
    <div class="menu-item">
      <div class="thumb ${brandMedia}">${brandInfo.icon}</div>
      <div class="info">
        <h4><span class="dot ${m.veg ? 'dot-veg' : 'dot-nonveg'}"></span>${m.name}</h4>
        <p>${m.desc}</p>
        <div class="price-row"><span class="price">₹${m.price}</span></div>
      </div>
    </div>`).join("");

  // Reviews
  const reviews = ABRA.reviews.filter(r => r.outlet === outlet.slug);
  const reviewsWrap = document.getElementById("outlet-reviews");
  reviewsWrap.innerHTML = reviews.length ? reviews.map(r => `
    <div class="quote-card">
      <span class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
      <p>“${r.text}”</p>
      <div class="who"><div class="avatar">${r.name.charAt(0)}</div><strong style="font-size:.9rem;">${r.name}</strong></div>
    </div>`).join("") : `<p class="hint">No reviews yet for this outlet — be the first to visit and share your experience.</p>`;

  // Offers
  const offers = ABRA.offers.filter(o => o.outlet === outlet.slug || o.outlet === "all");
  const offersWrap = document.getElementById("outlet-offers");
  offersWrap.innerHTML = offers.length ? offers.map(o => `
    <div class="card"><div class="card-body">
      <span class="badge badge-gold">${o.tag}</span>
      <h3 style="margin-top:8px;font-size:1.05rem;">${o.title}</h3>
      <p>${o.desc}</p>
    </div></div>`).join("") : `<p class="hint">No active offers at this outlet right now.</p>`;

  document.getElementById("order-link").classList.add(brandBtn);
});
