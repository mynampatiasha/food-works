/* =========================================================
   ABRA FOOD — Reusable cascading Country > State > City > Outlet
   picker. Used on Home, Locations, Order and Reserve pages so
   the "select nearest outlet" pattern is written once.
   ========================================================= */

ABRA.initLocationPicker = function (opts) {
  const countryEl = document.getElementById(opts.countryId);
  const stateEl = document.getElementById(opts.stateId);
  const cityEl = document.getElementById(opts.cityId);
  const outletEl = opts.outletId ? document.getElementById(opts.outletId) : null;
  if (!countryEl || !stateEl || !cityEl) return null;

  function fillSelect(el, items, placeholder, disabled) {
    el.innerHTML = `<option value="">${placeholder}</option>` +
      items.map(i => `<option value="${i.value}">${i.label}</option>`).join("");
    el.disabled = disabled;
  }

  function loadCountries() {
    fillSelect(countryEl, ABRA.locations.map(c => ({ value: c.code, label: c.name })), "Select Country", false);
    fillSelect(stateEl, [], "Select State", true);
    fillSelect(cityEl, [], "Select City", true);
    if (outletEl) fillSelect(outletEl, [], "Select Outlet", true);
  }

  function onCountryChange() {
    const states = ABRA.getStatesForCountry(countryEl.value);
    fillSelect(stateEl, states.map(s => ({ value: s.code, label: s.name })), "Select State", states.length === 0);
    fillSelect(cityEl, [], "Select City", true);
    if (outletEl) fillSelect(outletEl, [], "Select Outlet", true);
    if (opts.onChange) opts.onChange(currentSelection());
  }

  function onStateChange() {
    const cities = ABRA.getCitiesForState(countryEl.value, stateEl.value);
    fillSelect(cityEl, cities.map(c => ({ value: c.code, label: c.name })), "Select City", cities.length === 0);
    if (outletEl) fillSelect(outletEl, [], "Select Outlet", true);
    if (opts.onChange) opts.onChange(currentSelection());
  }

  function onCityChange() {
    if (outletEl) {
      let outlets = ABRA.getOutletsForCity(countryEl.value, stateEl.value, cityEl.value);
      if (opts.brandFilter) outlets = outlets.filter(o => o.brand === opts.brandFilter());
      fillSelect(outletEl, outlets.map(o => ({ value: o.slug, label: o.name })), "Select Outlet", outlets.length === 0);
    }
    if (opts.onChange) opts.onChange(currentSelection());
  }

  function currentSelection() {
    return { country: countryEl.value, state: stateEl.value, city: cityEl.value, outlet: outletEl ? outletEl.value : null };
  }

  countryEl.addEventListener("change", onCountryChange);
  stateEl.addEventListener("change", onStateChange);
  cityEl.addEventListener("change", onCityChange);
  if (outletEl) outletEl.addEventListener("change", () => { if (opts.onChange) opts.onChange(currentSelection()); });

  loadCountries();

  return {
    get: currentSelection,
    set(sel) {
      if (!sel) return;
      if (sel.country) { countryEl.value = sel.country; onCountryChange(); }
      if (sel.state) { stateEl.value = sel.state; onStateChange(); }
      if (sel.city) { cityEl.value = sel.city; onCityChange(); }
      if (sel.outlet && outletEl) { outletEl.value = sel.outlet; }
    },
    refreshOutlets: onCityChange
  };
};
