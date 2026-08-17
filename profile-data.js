async function loadProfileData() {
  const script = document.querySelector('script[src$="profile-data.js"]');
  const profileUrl = new URL("profile.json", new URL(".", script.src));
  const response = await fetch(profileUrl);

  if (!response.ok) {
    throw new Error("profile.json을 불러오지 못했습니다.");
  }

  return response.json();
}

const escapeProfileHtml = (value = "") => String(value).replace(
  /[&<>"']/g,
  (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]
);

function resolveProfileAsset(path) {
  const script = document.querySelector('script[src$="profile-data.js"]');
  return new URL(path, new URL(".", script.src));
}

function highlightCpp(source) {
  const tokens = /("(?:\\.|[^"\\])*")|(#\w+)|\b(void|if|else|return|class|struct|const|bool|int|float|auto|public|private|protected)\b|\b(FString|TArray|AJinYeJun|Programmer)\b|\b([A-Za-z_]\w*)(?=\s*\()/g;

  return source.split("\n").map((line) => {
    const commentIndex = line.indexOf("//");
    const code = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    const comment = commentIndex >= 0 ? line.slice(commentIndex) : "";
    let cursor = 0;
    let highlightedCode = "";

    for (const match of code.matchAll(tokens)) {
      highlightedCode += escapeProfileHtml(code.slice(cursor, match.index));

      if (match[1]) {
        highlightedCode += `<span class="code-string">${escapeProfileHtml(match[0])}</span>`;
      } else if (match[2]) {
        highlightedCode += `<span class="code-preprocessor">${escapeProfileHtml(match[0])}</span>`;
      } else if (match[3]) {
        highlightedCode += `<span class="code-keyword">${escapeProfileHtml(match[0])}</span>`;
      } else if (match[4]) {
        highlightedCode += `<span class="code-type">${escapeProfileHtml(match[0])}</span>`;
      } else if (match[5]) {
        highlightedCode += `<span class="code-function">${escapeProfileHtml(match[0])}</span>`;
      }

      cursor = match.index + match[0].length;
    }

    highlightedCode += escapeProfileHtml(code.slice(cursor));
    const highlightedComment = comment ? `<span class="code-muted">${escapeProfileHtml(comment)}</span>` : "";
    return highlightedCode + highlightedComment;
  }).join("\n");
}

async function renderHeroCode(codeData) {
  const codeElement = document.querySelector("#hero-code");
  if (!codeElement || !codeData?.source) return;

  document.querySelectorAll("[data-hero-code-title]").forEach((element) => {
    element.textContent = codeData.title;
  });

  try {
    const response = await fetch(resolveProfileAsset(codeData.source));
    if (!response.ok) throw new Error("코드 파일을 불러오지 못했습니다.");
    codeElement.innerHTML = highlightCpp(await response.text());
    codeElement.dataset.language = codeData.language ?? "text";
  } catch (error) {
    console.error(error);
    codeElement.textContent = error.message;
  }
}

function renderSkills(skills = []) {
  const grid = document.querySelector("#skills-grid");
  if (!grid) return;

  grid.innerHTML = skills.map((skill, index) => `
    <article class="skill-card reveal">
      <span class="skill-number">${String(index + 1).padStart(2, "0")}</span>
      <h3>${escapeProfileHtml(skill.title)}</h3>
      <p>${escapeProfileHtml(skill.description)}</p>
      <div class="skill-list">${(skill.items ?? []).map((item) => `<span>${escapeProfileHtml(item)}</span>`).join("")}</div>
    </article>`).join("");
}

function renderProblemSolving(cases = []) {
  const grid = document.querySelector("#case-grid");
  if (!grid) return;

  grid.innerHTML = cases.map((item, index) => `
    <article class="case-card reveal">
      <div class="case-header">
        <span>CASE ${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeProfileHtml(item.title)}</strong>
      </div>
      <div class="case-body">
        <div><h4>문제</h4><p>${escapeProfileHtml(item.problem)}</p></div>
        <div><h4>원인</h4><p>${escapeProfileHtml(item.cause)}</p></div>
        <div><h4>해결</h4><p>${escapeProfileHtml(item.solution)}</p></div>
        <div class="case-result"><span>RESULT</span><strong>${escapeProfileHtml(item.result)}</strong></div>
      </div>
    </article>`).join("");
}

function applyProfileData(profile) {
  window.profileData = profile;
  renderHeroCode(profile.hero_code);
  renderSkills(profile.skills);
  renderProblemSolving(profile.problem_solving);
  document.querySelectorAll(".logo-mark").forEach((element) => {
    element.textContent = profile.initials;
  });

  document.querySelectorAll(".logo-text").forEach((element) => {
    element.textContent = profile.role;
  });

  document.querySelectorAll("[data-profile-email]").forEach((element) => {
    element.href = `mailto:${profile.email}`;
    element.textContent = `${profile.email} ↗`;
  });

  document.querySelectorAll("[data-profile-github]").forEach((element) => {
    element.href = profile.github;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-profile-copyright]").forEach((element) => {
    element.textContent = `© ${profile.copyright_year} ${profile.name}. Game Programmer Portfolio.`;
  });

  const projectTitle = document.title.split("|")[0].trim();
  document.title = `${projectTitle} | ${profile.name}`;
  window.dispatchEvent(new Event("portfolioRendered"));
}

loadProfileData().then(applyProfileData).catch(console.error);

window.addEventListener("projectDetailRendered", () => {
  if (window.profileData) applyProfileData(window.profileData);
});
