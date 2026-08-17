const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

async function loadPortfolioData() {
  const response = await fetch("projects.json");
  if (!response.ok) throw new Error("projects.json을 불러오지 못했습니다.");
  return response.json();
}

function renderProjectCards(data) {
  const list = document.querySelector("#project-list");
  if (!list) return;
  list.innerHTML = data.projects.map((p, index) => `
    <a class="project-card ${index === 0 ? "featured " : ""}reveal" href="project.html?id=${encodeURIComponent(p.id)}" aria-label="${escapeHtml(p.title)} 상세 페이지 보기">
      <div class="project-image ${escapeHtml(p.imageClass)}">
        <div class="project-overlay"><span>${escapeHtml(p.number)}</span><p>${escapeHtml(p.subtitle)}</p></div>
      </div>
      <div class="project-content">
        <div class="project-meta"><span>${escapeHtml(p.type)}</span><span>${escapeHtml(p.year)}</span></div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.summary)}</p>
        <div class="tech-tags">${p.tech.map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
        <ul class="project-points">${p.points.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
        <div class="project-links" aria-hidden="true"><span>상세 보기 ↗</span><span>GitHub</span><span>Demo</span></div>
      </div>
    </a>`).join("");
}

function renderProjectDetail(data) {
  const root = document.querySelector("#project-detail");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const idx = Math.max(0, data.projects.findIndex(p => p.id === id));
  const p = data.projects[idx] || data.projects[0];
  const next = data.projects[(idx + 1) % data.projects.length];
  document.title = `${p.title} | ${data.profile.name}`;
  root.innerHTML = `
    <section class="section detail-hero reveal"><a class="detail-back" href="index.html#projects">← 프로젝트 목록으로</a><div class="detail-hero-grid"><div><p class="eyebrow">PROJECT ${escapeHtml(p.number)} · ${escapeHtml(p.subtitle.toUpperCase())}</p><h1>${escapeHtml(p.title)}</h1><p class="detail-lead">${escapeHtml(p.lead)}</p></div><div class="detail-summary"><div><span>TYPE</span><strong>${escapeHtml(p.type)}</strong></div><div><span>PERIOD</span><strong>${escapeHtml(p.period)}</strong></div><div><span>ROLE</span><strong>${escapeHtml(p.roleSummary)}</strong></div><div><span>ENGINE</span><strong>${escapeHtml(p.engine)}</strong></div></div></div></section>
    <section class="section"><div class="detail-media reveal"><div class="detail-media-inner"><span>GAMEPLAY VIDEO / GIF</span><strong>실제 플레이 영상을 배치하는 영역</strong><p>YouTube 영상, MP4 또는 GIF로 교체하세요.</p></div></div></section>
    <section class="section detail-layout"><div class="detail-content">
      <section class="reveal" id="overview"><p class="eyebrow">01 · OVERVIEW</p><h2>프로젝트 개요</h2><p>${escapeHtml(p.overview)}</p><div class="tech-tags">${p.tech.map(t=>`<span>${escapeHtml(t)}</span>`).join("")}</div></section>
      <section class="reveal" id="implementation"><p class="eyebrow">02 · IMPLEMENTATION</p><h2>핵심 구현</h2><ul>${p.implementation.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul><div class="architecture-box">${p.architecture.map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${escapeHtml(x)}</strong></div>`).join("")}</div></section>
      <section class="reveal" id="problem"><p class="eyebrow">03 · PROBLEM SOLVING</p><h2>문제 해결 과정</h2><h3>문제</h3><p>${escapeHtml(p.problem.problem)}</p><h3>해결 방법</h3><p>${escapeHtml(p.problem.solution)}</p><div class="detail-highlight"><strong>결과</strong><span>${escapeHtml(p.problem.result)}</span></div></section>
      <section class="reveal" id="code"><p class="eyebrow">04 · CODE & DOCUMENTS</p><h2>코드와 문서</h2><p>핵심 코드 일부, 클래스 다이어그램, 네트워크 흐름도 또는 기술 문서를 배치하는 영역입니다. 전체 코드를 붙이기보다 설계 판단을 설명할 수 있는 부분만 선별하는 것이 좋습니다.</p><div class="project-links"><a href="${escapeHtml(p.links.github)}">GitHub 저장소 ↗</a><a href="${escapeHtml(p.links.document)}">기술 문서 ↗</a><a href="${escapeHtml(p.links.demo)}">시연 영상 ↗</a></div></section>
      <a class="next-project reveal" href="project.html?id=${encodeURIComponent(next.id)}"><div><span>NEXT PROJECT</span><strong>${escapeHtml(next.title)}</strong></div><b>프로젝트 보기 →</b></a>
    </div><aside class="detail-sidebar reveal"><h3>페이지 목차</h3><a href="#overview">프로젝트 개요</a><a href="#implementation">핵심 구현</a><a href="#problem">문제 해결 과정</a><a href="#code">코드와 문서</a><a class="button button-primary" href="${escapeHtml(p.links.github)}">GitHub 보기</a></aside></section>`;
}

loadPortfolioData().then(data => {
  renderProjectCards(data);
  renderProjectDetail(data);
  window.dispatchEvent(new Event("portfolioRendered"));
}).catch(error => {
  console.error(error);
  document.body.insertAdjacentHTML("beforeend", `<div style="position:fixed;left:20px;right:20px;bottom:20px;z-index:999;padding:16px;background:#3b1717;color:white">${escapeHtml(error.message)}<br>README의 로컬 서버 실행 방법을 확인하세요.</div>`);
});