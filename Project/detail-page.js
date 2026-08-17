const escapeDetailHtml = (value = "") => String(value).replace(
  /[&<>"']/g,
  (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]
);

const formatDetailSemester = (semester) => {
  const value = Number(semester);
  if (!Number.isInteger(value) || value < 1) return String(semester ?? "");
  const grade = Math.ceil(value / 2);
  const term = value % 2 === 1 ? 1 : 2;
  return `${grade}학년 ${term}학기`;
};

async function loadProjectDetails() {
  const response = await fetch("../projects.json");

  if (!response.ok) {
    throw new Error("projects.json을 불러오지 못했습니다.");
  }

  return response.json();
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsedUrl = new URL(normalizedUrl);
    let videoId = "";

    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1).split("/")[0];
    } else if (parsedUrl.hostname.endsWith("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") ?? "";
      } else {
        const match = parsedUrl.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
        videoId = match?.[1] ?? "";
      }
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : "";
  } catch {
    return "";
  }
}

function renderProjectDetail(projects) {
  const root = document.querySelector("#project-detail");
  const filename = decodeURIComponent(location.pathname.split("/").pop());
  const index = projects.findIndex((project) => project.site.split("/").pop() === filename);
  const projectIndex = index >= 0 ? index : 0;
  const project = projects[projectIndex];
  const activeProjects = projects.filter((item) => item.hide !== true);
  const activeIndex = activeProjects.findIndex((item) => item.site === project.site);
  const next = activeProjects[(activeIndex + 1) % activeProjects.length] ?? projects[0];

  if (!root || !project) return;

  const implementation = project.implementation ?? project.features ?? [];
  const architecture = project.architecture ?? [];
  const problem = project.problem ?? {};
  const imagePath = `../${project.image_src.replace(/^\.?\//, "")}`;
  const youtubeEmbedUrl = getYouTubeEmbedUrl(project.youtube_url);
  const media = youtubeEmbedUrl
    ? `<iframe src="${escapeDetailHtml(youtubeEmbedUrl)}" title="${escapeDetailHtml(project.title)} 플레이 영상" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    : `<img src="${escapeDetailHtml(imagePath)}" alt="${escapeDetailHtml(project.title)} 프로젝트 이미지">`;

  document.title = `${project.title} | Jin Yejun`;
  root.innerHTML = `
    <section class="section detail-hero reveal">
      <a class="detail-back" href="../index.html#projects">← 프로젝트 목록으로</a>
      <div class="detail-hero-grid">
        <div>
          <p class="eyebrow">PROJECT ${String(projectIndex + 1).padStart(2, "0")} · ${escapeDetailHtml(project.title.toUpperCase())}</p>
          <h1>${escapeDetailHtml(project.title)}</h1>
          <p class="detail-lead">${escapeDetailHtml(project.explanation)}</p>
        </div>
        <div class="detail-summary">
          <div><span>TYPE</span><strong>${escapeDetailHtml(project.purpose)}</strong></div>
          <div><span>SEMESTER</span><strong>${escapeDetailHtml(formatDetailSemester(project.semester))}</strong></div>
          <div><span>TEAM</span><strong>${project.team_size ? `${escapeDetailHtml(project.team_size)}명` : "미입력"}</strong></div>
          <div><span>ENGINE</span><strong>${escapeDetailHtml((project.tags ?? []).join(" · "))}</strong></div>
          <div><span>ROLE</span><strong>${escapeDetailHtml(project.role ?? "미입력")}</strong></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="detail-media reveal">
        ${media}
      </div>
    </section>

    <section class="section detail-layout">
      <div class="detail-content">
        <section class="reveal" id="overview">
          <p class="eyebrow">01 · OVERVIEW</p>
          <h2>프로젝트 개요</h2>
          <p>${escapeDetailHtml(project.overview)}</p>
          <div class="tech-tags">${(project.tags ?? []).map((tag) => `<span>${escapeDetailHtml(tag)}</span>`).join("")}</div>
        </section>

        <section class="reveal" id="implementation">
          <p class="eyebrow">02 · IMPLEMENTATION</p>
          <h2>핵심 구현</h2>
          <ul>${implementation.map((item) => `<li>${escapeDetailHtml(item)}</li>`).join("")}</ul>
          <div class="architecture-box">${architecture.map((item, itemIndex) => `<div><span>${String(itemIndex + 1).padStart(2, "0")}</span><strong>${escapeDetailHtml(item)}</strong></div>`).join("")}</div>
        </section>

        <section class="reveal" id="problem">
          <p class="eyebrow">03 · PROBLEM SOLVING</p>
          <h2>문제 해결 과정</h2>
          <h3>문제</h3>
          <p>${escapeDetailHtml(problem.issue)}</p>
          <h3>해결 방법</h3>
          <p>${escapeDetailHtml(problem.solution)}</p>
          <div class="detail-highlight"><strong>결과</strong><span>${escapeDetailHtml(problem.result)}</span></div>
        </section>

        <!-- 코드와 문서 섹션: 필요할 때 주석을 해제하세요.
        <section class="reveal" id="code">
          <p class="eyebrow">04 · CODE & DOCUMENTS</p>
          <h2>코드와 문서</h2>
          <p>프로젝트의 핵심 코드, 설계 자료와 플레이 영상을 추가할 수 있는 영역입니다.</p>
          <div class="project-links"><a href="#" data-profile-github>GitHub 저장소 ↗</a><a href="#">기술 문서 ↗</a><a href="#">시연 영상 ↗</a></div>
        </section>
        -->

        <a class="next-project reveal" href="${escapeDetailHtml(next.site.split("/").pop())}">
          <div><span>NEXT PROJECT</span><strong>${escapeDetailHtml(next.title)}</strong></div>
          <b>프로젝트 보기 →</b>
        </a>
      </div>

      <aside class="detail-sidebar reveal">
        <h3>페이지 목차</h3>
        <a href="#overview">프로젝트 개요</a>
        <a href="#implementation">핵심 구현</a>
        <a href="#problem">문제 해결 과정</a>
        <!-- <a href="#code">코드와 문서</a> -->
        <a class="button button-primary" href="../index.html#contact">Contact</a>
      </aside>
    </section>`;

  window.dispatchEvent(new Event("projectDetailRendered"));
  window.dispatchEvent(new Event("portfolioRendered"));
}

loadProjectDetails().then(renderProjectDetail).catch((error) => {
  console.error(error);
  document.querySelector("#project-detail").innerHTML = `<section class="section detail-hero"><h1>${escapeDetailHtml(error.message)}</h1></section>`;
});
