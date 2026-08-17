const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

const formatSemester = (semester) => {
  const value = Number(semester);
  if (!Number.isInteger(value) || value < 1) return String(semester ?? "");
  const grade = Math.ceil(value / 2);
  const term = value % 2 === 1 ? 1 : 2;
  return `${grade}학년 ${term}학기`;
};

async function loadPortfolioData() {
  const response = await fetch("projects.json");
  if (!response.ok) throw new Error("projects.json을 불러오지 못했습니다.");
  return response.json();
}

function renderProjectCards(projects) {
  const list = document.querySelector("#project-list");
  if (!list) return;
  const activeProjects = projects.filter((project) => project.hide !== true);
  document.querySelectorAll("[data-project-count]").forEach((element) => {
    element.textContent = `${activeProjects.length} Projects`;
  });
  const limit = Number.parseInt(list.dataset.limit, 10);
  const visibleProjects = Number.isFinite(limit) ? activeProjects.slice(0, limit) : activeProjects;
  list.innerHTML = visibleProjects.map((p, index) => `
    <article class="project-card ${index === 0 ? "featured " : ""}reveal">
      <a class="project-image" href="${escapeHtml(p.site)}" style="background-image: url('${escapeHtml(p.image_src)}')" aria-label="${escapeHtml(p.title)} 상세 페이지 보기">
        <div class="project-overlay"><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(formatSemester(p.semester))}</p></div>
      </a>
      <div class="project-content">
        <div class="project-meta"><span>${escapeHtml(p.purpose)}</span><span>${escapeHtml(formatSemester(p.semester))}${p.team_size ? ` · 팀 인원: ${escapeHtml(p.team_size)}명` : ""}</span></div>
        <h3><a class="project-title-link" href="${escapeHtml(p.site)}">${escapeHtml(p.title)}</a></h3>
        <p>${escapeHtml(p.explanation)}</p>
        <div class="tech-tags">${(p.tags ?? []).map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
        <ul class="project-points">${(p.features ?? []).map(feature => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
        <div class="project-links">
          <a href="${escapeHtml(p.site)}">상세 보기 ↗</a>
          ${p.github_url ? `<a href="${escapeHtml(p.github_url)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ""}
          ${p.demo_url ? `<a href="${escapeHtml(p.demo_url)}" target="_blank" rel="noopener noreferrer">Play Demo ↗</a>` : ""}
        </div>
      </div>
    </article>`).join("");
}

function renderProjectDetail(projects) {
  const root = document.querySelector("#project-detail");
  if (!root) return;
  const title = new URLSearchParams(location.search).get("title");
  const p = projects.find(project => project.title === title) ?? projects[0];
  if (!p) return;
  document.title = `${p.title} | Jin Yejun`;
  root.innerHTML = `
    <section class="section detail-hero reveal"><a class="detail-back" href="index.html#projects">← 프로젝트 목록으로</a><div class="detail-hero-grid"><div><p class="eyebrow">${escapeHtml(p.purpose)} · ${escapeHtml(formatSemester(p.semester))}</p><h1>${escapeHtml(p.title)}</h1><p class="detail-lead">${escapeHtml(p.explanation)}</p><div class="tech-tags">${(p.tags ?? []).map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div></div></section>
    <section class="section"><div class="detail-media reveal" style="background-image:url('${escapeHtml(p.image_src)}');background-size:cover;background-position:center"></div></section>`;
}

loadPortfolioData().then(data => {
  const projects = Array.isArray(data) ? data : (data.projects ?? []);
  renderProjectCards(projects);
  renderProjectDetail(projects);
  window.dispatchEvent(new Event("portfolioRendered"));
}).catch(error => {
  console.error(error);
  document.body.insertAdjacentHTML("beforeend", `<div style="position:fixed;left:20px;right:20px;bottom:20px;z-index:999;padding:16px;background:#3b1717;color:white">${escapeHtml(error.message)}<br>README의 로컬 서버 실행 방법을 확인하세요.</div>`);
});
