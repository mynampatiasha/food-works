document.addEventListener("DOMContentLoaded", () => {
  const extraFields = {
    general: { show: false, label: "Message" },
    catering: { show: true, ph: "Event location & guest count", label: "Catering Requirements" },
    franchise: { show: true, ph: "Preferred city / territory", label: "Tell us about your investment plans" },
    corporate: { show: true, ph: "Company name", label: "Corporate Enquiry Details" },
    feedback: { show: true, ph: "Which outlet is this about?", label: "Your Feedback" },
  };

  function setTab(tab) {
    document.querySelectorAll("#tab-nav a").forEach(a => a.classList.toggle("active", a.dataset.tab === tab));
    const cfg = extraFields[tab];
    const extra = document.getElementById("extra-field");
    extra.innerHTML = cfg.show ? `<label>Additional Info</label><input type="text" id="ct-extra" placeholder="${cfg.ph}">` : "";
    document.getElementById("msg-label").textContent = cfg.label;
    document.getElementById("ct-success").style.display = "none";
  }

  document.querySelectorAll("#tab-nav a").forEach(a => a.addEventListener("click", (e) => {
    e.preventDefault();
    setTab(a.dataset.tab);
  }));

  document.getElementById("ct-submit").addEventListener("click", () => {
    const name = document.getElementById("ct-name").value.trim();
    const email = document.getElementById("ct-email").value.trim();
    if (!name || !email) { ABRA.toast("Please enter your name and email"); return; }
    document.getElementById("ct-success").style.display = "block";
    ["ct-name","ct-email","ct-phone","ct-message"].forEach(id => document.getElementById(id).value = "");
    const extra = document.getElementById("ct-extra");
    if (extra) extra.value = "";
  });

  setTab("general");
});
