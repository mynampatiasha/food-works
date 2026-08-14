/* =========================================================
   ABRA FOOD — Shared layout (header, footer, cart drawer)
   Injected via JS (not fetch()) so the site works when opened
   straight from disk (file://) and not just from a server.
   ========================================================= */

(function () {
  const NAV_LINKS = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "menu.html", label: "Menu", key: "menu" },
    { href: "order.html", label: "Order Online", key: "order" },
    { href: "locations.html", label: "Locations", key: "locations" },
  ];
  const BRAND_LINKS = [
    { href: "veg.html", label: "ABRA VEG", key: "veg" },
    { href: "non-veg.html", label: "ABRA NON-VEG", key: "nonveg" },
    { href: "cafe.html", label: "ABRA CAFÉ", key: "cafe" },
  ];
  const MORE_LINKS = [
    { href: "about.html", label: "About", key: "about" },
    { href: "catering.html", label: "Catering", key: "catering" },
    { href: "events.html", label: "Events", key: "events" },
    { href: "offers.html", label: "Offers", key: "offers" },
    { href: "careers.html", label: "Careers", key: "careers" },
    { href: "reserve.html", label: "Reserve a Table", key: "reserve" },
    { href: "admin.html", label: "Admin CMS", key: "admin" },
    { href: "contact.html", label: "Contact", key: "contact" },
  ];

  function linkHtml(links, activeKey) {
    return links.map(l => `<a href="${l.href}" class="${l.key === activeKey ? "active" : ""}">${l.label}</a>`).join("");
  }

  function headerHtml(activeKey) {
    return `
    <div class="topbar">
      <a href="index.html" class="brand-logo"><span class="mark">A</span> ABRA <span style="color:var(--gold-dark)">FOOD</span></a>
      <nav class="main-nav" id="main-nav">
        <div class="nav-more" id="brands-dd">
          <a href="#" style="display:flex;align-items:center;gap:4px;" id="brands-toggle">Brands ▾</a>
          <div class="nav-more-panel">${linkHtml(BRAND_LINKS, activeKey)}</div>
        </div>
        ${linkHtml(NAV_LINKS, activeKey)}
        <div class="nav-more" id="more-dd">
          <a href="#" style="display:flex;align-items:center;gap:4px;" id="more-toggle">More ▾</a>
          <div class="nav-more-panel">${linkHtml(MORE_LINKS, activeKey)}</div>
        </div>
        <a href="admin.html" class="badge badge-gold" style="margin:8px 14px;">ABRA CLUB</a>
      </nav>
      <div class="nav-actions">
        <button class="icon-btn" id="search-btn" title="Search" aria-label="Search">🔍</button>
        <button class="icon-btn" id="cart-btn" title="Cart" aria-label="Cart">🛒<span class="cart-count" id="cart-count">0</span></button>
        <button class="hamburger" id="hamburger" aria-label="Menu">☰</button>
      </div>
    </div>`;
  }

  function footerHtml() {
    return `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand-logo"><span class="mark">A</span> ABRA FOOD</div>
          <p>One Brand. Every Taste. Every Table. Everywhere. A world of taste — Veg, Non-Veg, Café, Hotels &amp; Catering — under one roof.</p>
          <div class="social-row">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="YouTube">YT</a>
            <a href="#" aria-label="LinkedIn">IN</a>
          </div>
        </div>
        <div><h4>About</h4><ul>
          <li><a href="about.html">Our Story</a></li>
          <li><a href="index.html#brands">Our Brands</a></li>
          <li><a href="locations.html">Locations</a></li>
          <li><a href="careers.html">Careers</a></li>
          <li><a href="#">Franchise</a></li>
        </ul></div>
        <div><h4>Dining</h4><ul>
          <li><a href="veg.html">ABRA Veg</a></li>
          <li><a href="non-veg.html">ABRA Non-Veg</a></li>
          <li><a href="cafe.html">ABRA Café</a></li>
          <li><a href="#">ABRA Hotels <span class="badge badge-gold" style="margin-left:4px;">Soon</span></a></li>
        </ul></div>
        <div><h4>Services</h4><ul>
          <li><a href="order.html">Order Online</a></li>
          <li><a href="reserve.html">Reservations</a></li>
          <li><a href="catering.html">Catering</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="#">Food Store <span class="badge badge-gold" style="margin-left:4px;">Soon</span></a></li>
        </ul></div>
        <div><h4>Support</h4><ul>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="offers.html">Offers</a></li>
          <li><a href="contact.html">Feedback</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Privacy</a></li>
        </ul></div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="footer-year"></span> ABRA FOOD. All rights reserved.</span>
        <span><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Refund Policy</a></span>
      </div>
    </div>`;
  }

  function mobileBarHtml() {
    return `
    <div class="row">
      <a href="order.html"><span class="ic">🛍️</span>Order</a>
      <a href="reserve.html"><span class="ic">🪑</span>Reserve</a>
      <a href="locations.html"><span class="ic">📍</span>Locations</a>
      <a href="menu.html"><span class="ic">📋</span>Menu</a>
    </div>`;
  }

  function cartDrawerHtml() {
    return `
    <div class="cart-overlay" id="cart-overlay"></div>
    <aside class="cart-drawer" id="cart-drawer">
      <div class="cd-head">
        <h3 style="margin:0;">Your Cart</h3>
        <button class="icon-btn" id="cart-close">✕</button>
      </div>
      <div class="cd-body" id="cart-body"></div>
      <div class="cd-foot" id="cart-foot"></div>
    </aside>`;
  }

  function brandThumbClass(brand) {
    return brand === "veg" ? "media-veg" : brand === "nonveg" ? "media-nonveg" : "media-cafe";
  }
  function brandIcon(brand) {
    return brand === "veg" ? "🥗" : brand === "nonveg" ? "🍗" : "☕";
  }

  function renderCart() {
    const cart = ABRA.store.getCart();
    const body = document.getElementById("cart-body");
    const foot = document.getElementById("cart-foot");
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = ABRA.store.cartCount();
    if (!body) return;

    if (!cart.lines.length) {
      body.innerHTML = `<div style="text-align:center;padding:40px 10px;color:var(--ink-soft);">
        <div style="font-size:2.4rem;margin-bottom:10px;">🛒</div>
        <p>Your cart is empty.</p>
        <a href="order.html" class="btn btn-gold btn-sm">Start an Order</a>
      </div>`;
      foot.innerHTML = "";
      return;
    }
    const outlet = ABRA.getOutlet(cart.outletSlug);
    const brand = outlet ? outlet.brand : "veg";
    body.innerHTML = `<p class="hint" style="margin-bottom:10px;">Ordering from <strong>${outlet ? outlet.name : ""}</strong></p>` +
      cart.lines.map(l => `
      <div class="cart-line">
        <div class="thumb ${brandThumbClass(brand)}">${brandIcon(brand)}</div>
        <div class="info">
          <h5>${l.name}</h5>
          <div class="hint">₹${l.price} × ${l.qty}</div>
        </div>
        <div class="qty-add">
          <button data-decr="${l.id}">−</button>
          <span>${l.qty}</span>
          <button data-incr="${l.id}">+</button>
        </div>
      </div>`).join("");
    const total = ABRA.store.cartTotal();
    foot.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>₹${total}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${total > 499 ? "Free" : "₹40"}</span></div>
      <div class="summary-row total"><span>Total</span><span>₹${total + (total > 499 || total === 0 ? 0 : 40)}</span></div>
      <a href="order.html#checkout" class="btn btn-primary btn-block" style="margin-top:14px;">Proceed to Checkout</a>`;

    body.querySelectorAll("[data-incr]").forEach(b => b.addEventListener("click", () => {
      const line = cart.lines.find(l => l.id === b.dataset.incr);
      ABRA.store.setQty(b.dataset.incr, line.qty + 1);
      renderCart();
    }));
    body.querySelectorAll("[data-decr]").forEach(b => b.addEventListener("click", () => {
      const line = cart.lines.find(l => l.id === b.dataset.decr);
      ABRA.store.setQty(b.dataset.decr, line.qty - 1);
      renderCart();
    }));
  }

  function openCart() {
    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("cart-overlay").classList.add("open");
    renderCart();
  }
  function closeCart() {
    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("cart-overlay").classList.remove("open");
  }

  function initLayout() {
    const activeKey = document.body.dataset.page || "";
    const headerEl = document.getElementById("site-header");
    const footerEl = document.getElementById("site-footer");
    if (headerEl) headerEl.innerHTML = headerHtml(activeKey);
    if (footerEl) { footerEl.innerHTML = footerHtml(); document.getElementById("footer-year").textContent = new Date().getFullYear(); }

    // Mobile action bar
    const bar = document.createElement("div");
    bar.className = "mobile-action-bar";
    bar.innerHTML = mobileBarHtml();
    document.body.appendChild(bar);

    // Cart drawer
    const cartWrap = document.createElement("div");
    cartWrap.innerHTML = cartDrawerHtml();
    document.body.appendChild(cartWrap);

    // Toast container
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.id = "abra-toast";
    document.body.appendChild(toast);

    // Hamburger
    document.getElementById("hamburger").addEventListener("click", () => {
      document.getElementById("main-nav").classList.toggle("open");
    });
    // Dropdowns
    ["brands-dd", "more-dd"].forEach(id => {
      const dd = document.getElementById(id);
      const toggle = dd.querySelector("a");
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        dd.classList.toggle("open");
      });
    });
    document.addEventListener("click", (e) => {
      ["brands-dd", "more-dd"].forEach(id => {
        const dd = document.getElementById(id);
        if (dd && !dd.contains(e.target)) dd.classList.remove("open");
      });
    });

    // Cart open/close
    document.getElementById("cart-btn").addEventListener("click", openCart);
    document.getElementById("cart-close").addEventListener("click", closeCart);
    document.getElementById("cart-overlay").addEventListener("click", closeCart);
    document.addEventListener("abra:cart-changed", renderCart);
    renderCart();

    // Search (simple redirect to menu with query)
    document.getElementById("search-btn").addEventListener("click", () => {
      const q = prompt("Search dishes, outlets or cities (e.g. 'Biryani', 'Whitefield')");
      if (q) window.location.href = "menu.html?q=" + encodeURIComponent(q);
    });

    // Reveal-on-scroll. Pages render most cards dynamically *after* this runs,
    // so a MutationObserver keeps picking up newly-added .reveal elements
    // instead of only scanning once at load (which would leave them stuck at
    // opacity:0 forever).
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    function observeReveals() {
      document.querySelectorAll(".reveal:not([data-observed])").forEach(el => {
        el.dataset.observed = "1";
        io.observe(el);
      });
    }
    observeReveals();
    new MutationObserver(observeReveals).observe(document.body, { childList: true, subtree: true });
  }

  ABRA.toast = function (msg) {
    const el = document.getElementById("abra-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(window.__abraToastTimer);
    window.__abraToastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  };

  ABRA.renderCart = renderCart;
  document.addEventListener("DOMContentLoaded", initLayout);
})();
