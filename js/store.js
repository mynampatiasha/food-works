/* =========================================================
   ABRA FOOD — Client-side store
   Cart, favourites and the "admin override" layer all live in
   localStorage for this Phase-1 static build. In Phase 3 these
   same function names would swap their bodies for API calls
   without any page needing to change.
   ========================================================= */

ABRA.store = (function () {
  const KEYS = {
    cart: "abra_cart",
    location: "abra_location",
    admin: "abra_admin_overrides",
    session: "abra_session"
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /* ---- Cart ---- */
  function getCart() { return read(KEYS.cart, { outletSlug: null, lines: [] }); }
  function saveCart(cart) { write(KEYS.cart, cart); document.dispatchEvent(new CustomEvent("abra:cart-changed")); }

  function addToCart(outletSlug, item, qty) {
    let cart = getCart();
    if (cart.outletSlug && cart.outletSlug !== outletSlug) {
      if (!confirm("Your cart has items from a different outlet. Start a new cart for this outlet?")) return cart;
      cart = { outletSlug, lines: [] };
    }
    cart.outletSlug = outletSlug;
    const existing = cart.lines.find(l => l.id === item.id);
    if (existing) existing.qty += qty;
    else cart.lines.push({ id: item.id, name: item.name, price: item.price, veg: item.veg, qty });
    cart.lines = cart.lines.filter(l => l.qty > 0);
    saveCart(cart);
    return cart;
  }
  function setQty(itemId, qty) {
    const cart = getCart();
    const line = cart.lines.find(l => l.id === itemId);
    if (!line) return cart;
    line.qty = qty;
    cart.lines = cart.lines.filter(l => l.qty > 0);
    if (cart.lines.length === 0) cart.outletSlug = null;
    saveCart(cart);
    return cart;
  }
  function clearCart() { saveCart({ outletSlug: null, lines: [] }); }
  function cartCount() { return getCart().lines.reduce((n, l) => n + l.qty, 0); }
  function cartTotal() { return getCart().lines.reduce((n, l) => n + l.qty * l.price, 0); }

  /* ---- Selected location (for header / order flow) ---- */
  function getLocation() { return read(KEYS.location, null); }
  function setLocation(loc) { write(KEYS.location, loc); }

  /* ---- Admin overrides: outlets / menu / offers created or edited via admin.html ---- */
  function getOverrides() { return read(KEYS.admin, { outlets: [], menuItems: [], offers: [], deletedOutlets: [] }); }
  function saveOverrides(ov) { write(KEYS.admin, ov); }

  function upsertOutletOverride(outlet) {
    const ov = getOverrides();
    const i = ov.outlets.findIndex(o => o.slug === outlet.slug);
    if (i > -1) ov.outlets[i] = outlet; else ov.outlets.push(outlet);
    saveOverrides(ov);
  }
  function deleteOutletOverride(slug) {
    const ov = getOverrides();
    ov.outlets = ov.outlets.filter(o => o.slug !== slug);
    ov.deletedOutlets = Array.from(new Set([...ov.deletedOutlets, slug]));
    saveOverrides(ov);
  }
  function upsertMenuItemOverride(item) {
    const ov = getOverrides();
    const i = ov.menuItems.findIndex(m => m.id === item.id);
    if (i > -1) ov.menuItems[i] = item; else ov.menuItems.push(item);
    saveOverrides(ov);
  }
  function deleteMenuItemOverride(id) {
    const ov = getOverrides();
    ov.menuItems = ov.menuItems.filter(m => m.id !== id);
    saveOverrides(ov);
  }
  function upsertOfferOverride(offer) {
    const ov = getOverrides();
    const i = ov.offers.findIndex(o => o.id === offer.id);
    if (i > -1) ov.offers[i] = offer; else ov.offers.push(offer);
    saveOverrides(ov);
  }
  function deleteOfferOverride(id) {
    const ov = getOverrides();
    ov.offers = ov.offers.filter(o => o.id !== id);
    saveOverrides(ov);
  }

  /* Merge base data + overrides. Call once at page load (layout.js does this). */
  function applyOverrides() {
    const ov = getOverrides();
    if (ov.deletedOutlets && ov.deletedOutlets.length) {
      ABRA.outlets = ABRA.outlets.filter(o => !ov.deletedOutlets.includes(o.slug));
    }
    ov.outlets.forEach(o => {
      const i = ABRA.outlets.findIndex(x => x.slug === o.slug);
      if (i > -1) ABRA.outlets[i] = { ...ABRA.outlets[i], ...o }; else ABRA.outlets.push(o);
      // Admin-added outlets only exist in the flat outlets list unless we also
      // thread them into the Country > State > City tree that every cascading
      // picker on the site reads from.
      const country = ABRA.locations.find(c => c.code === o.country);
      const state = country && country.states.find(s => s.name === o.state);
      const city = state && state.cities.find(c => c.name === o.city);
      if (city && !city.outlets.includes(o.slug)) city.outlets.push(o.slug);
    });
    ov.menuItems.forEach(m => {
      const i = ABRA.menu.findIndex(x => x.id === m.id);
      if (i > -1) ABRA.menu[i] = { ...ABRA.menu[i], ...m }; else ABRA.menu.push(m);
    });
    ov.offers.forEach(o => {
      const i = ABRA.offers.findIndex(x => x.id === o.id);
      if (i > -1) ABRA.offers[i] = { ...ABRA.offers[i], ...o }; else ABRA.offers.push(o);
    });
  }

  function resetAllOverrides() {
    localStorage.removeItem(KEYS.admin);
  }

  return {
    getCart, saveCart, addToCart, setQty, clearCart, cartCount, cartTotal,
    getLocation, setLocation,
    getOverrides, upsertOutletOverride, deleteOutletOverride,
    upsertMenuItemOverride, deleteMenuItemOverride,
    upsertOfferOverride, deleteOfferOverride,
    applyOverrides, resetAllOverrides
  };
})();

ABRA.store.applyOverrides();
