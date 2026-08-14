document.addEventListener("DOMContentLoaded", () => {
  let dept = "all";
  let currentJobId = null;

  function renderJobs() {
    const jobs = dept === "all" ? ABRA.jobs : ABRA.jobs.filter(j => j.dept === dept);
    document.getElementById("job-list").innerHTML = jobs.map(j => `
      <div class="card"><div class="card-body" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <h3 style="font-size:1.05rem;margin-bottom:4px;">${j.title}</h3>
          <p class="hint" style="margin:0;">${j.dept} · ${j.location} · ${j.type}</p>
        </div>
        <button class="btn btn-primary btn-sm" data-apply="${j.id}">Apply</button>
      </div></div>`).join("") || `<p class="hint text-center">No open roles in this department right now.</p>`;

    document.querySelectorAll("[data-apply]").forEach(b => b.addEventListener("click", () => openModal(b.dataset.apply)));
  }

  document.querySelectorAll("#dept-filter .chip").forEach(c => c.addEventListener("click", () => {
    dept = c.dataset.dept;
    document.querySelectorAll("#dept-filter .chip").forEach(x => x.classList.toggle("active", x === c));
    renderJobs();
  }));

  function openModal(jobId) {
    currentJobId = jobId;
    const job = ABRA.jobs.find(j => j.id === jobId);
    document.getElementById("apply-title").textContent = "Apply — " + job.title;
    document.getElementById("apply-modal").classList.add("open");
  }
  document.getElementById("apply-close").addEventListener("click", () => document.getElementById("apply-modal").classList.remove("open"));
  document.getElementById("apply-modal").addEventListener("click", (e) => { if (e.target.id === "apply-modal") e.currentTarget.classList.remove("open"); });

  document.getElementById("apply-submit").addEventListener("click", () => {
    const name = document.getElementById("ap-name").value.trim();
    const email = document.getElementById("ap-email").value.trim();
    const errEl = document.getElementById("apply-error");
    if (!name || !email) {
      errEl.textContent = "Please enter your name and email.";
      errEl.classList.add("show");
      return;
    }
    errEl.classList.remove("show");
    document.getElementById("apply-modal").classList.remove("open");
    ABRA.toast("Application submitted! We'll be in touch.");
    ["ap-name","ap-email","ap-phone","ap-resume","ap-note"].forEach(id => document.getElementById(id).value = "");
  });

  renderJobs();
});
