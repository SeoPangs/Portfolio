/* ===============================
   ProjectCardFunction.js (최종본)
   - fetch 1회 캐싱
   - title로 카드 생성/삽입
   =============================== */

/** --------- 내부 캐시 --------- */
let _projectsCache = null;            // 한 번 로드된 JSON 데이터
let _projectsLoadingPromise = null;   // 동시 호출 시 중복 fetch 방지

/** --------- JSON 로더(캐시) --------- */
async function getProjects() {
  if (_projectsCache) return _projectsCache;
  if (_projectsLoadingPromise) return _projectsLoadingPromise;

  _projectsLoadingPromise = (async () => {
    const res = await fetch("./Project/ProjectList.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("프로젝트 JSON 불러오기 실패");
    const data = await res.json();
    _projectsCache = Array.isArray(data) ? data : [];
    return _projectsCache;
  })();

  return _projectsLoadingPromise.finally(() => { _projectsLoadingPromise = null; });
}

/** --------- 카드 생성기 --------- */
/**
 * 프로젝트 카드를 생성하는 함수
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.desc
 * @param {string} options.img
 * @param {string} options.link
 * @param {Array<{text:string, className:string, icon?:string}>} options.badges
 * @param {string} [options.team]
 * @returns {HTMLElement} article 요소
 */
function createProjectCard({ title, desc, img, link, badges = [], team = "" }) {
  const article = document.createElement("article");
  article.className = "project-card";
  const id = "proj-" + Math.random().toString(36).slice(2, 11);
  article.setAttribute("aria-labelledby", id);

  // 배지: dl > dt(숨김 라벨 1개) + dd* (배지들)
  const badgeBox = document.createElement("dl");
  badgeBox.className = "badge-container";
  badgeBox.style.margin = "0";
  badgeBox.setAttribute("aria-label", "프로젝트 특징");

  const dtHidden = document.createElement("dt");
  dtHidden.className = "visually-hidden";
  dtHidden.textContent = "특징";
  badgeBox.appendChild(dtHidden);

  badges.forEach(({ text, className, icon }) => {
    const dd = document.createElement("dd");
    dd.className = "badge " + (className || "tag");
    if (icon) {
      const i = document.createElement("img");
      i.src = icon;
      i.alt = ""; // 장식용
      dd.appendChild(i);
    }
    dd.appendChild(document.createTextNode(text));
    badgeBox.appendChild(dd);
  });
  article.appendChild(badgeBox);

  // 썸네일
  const thumb = document.createElement("img");
  thumb.className = "project-thumbnail";
  thumb.src = img;
  thumb.alt = `‘${title}’ 대표 이미지`;
  thumb.width = 640;
  thumb.height = 360;
  thumb.loading = "lazy";
  thumb.decoding = "async";
  article.appendChild(thumb);

  // 제목
  const h3 = document.createElement("h3");
  h3.id = id;
  h3.className = "project-title";

  const aTitle = document.createElement("a");
  aTitle.className = "project-link";
  aTitle.href = link;
  aTitle.textContent = title;

  h3.appendChild(aTitle);
  article.appendChild(h3);

  // 설명
  const p = document.createElement("p");
  p.textContent = desc || "";
  article.appendChild(p);

  // 팀/목적 등 표시
  if (team) {
    const teamDiv = document.createElement("div");
    teamDiv.className = "team-count";
    teamDiv.textContent = team;
    article.appendChild(teamDiv);
  }

  // 카드 전체 클릭(stretched-link)
  const stretched = document.createElement("a");
  stretched.className = "stretched-link";
  stretched.href = link;
  stretched.setAttribute("aria-label", `${title} 상세 보기`);

  const hiddenSpan = document.createElement("span");
  hiddenSpan.className = "visually-hidden";
  hiddenSpan.textContent = `${title}로 이동`;
  stretched.appendChild(hiddenSpan);

  article.appendChild(stretched);
  return article;
}

/** --------- title로 카드 삽입 --------- */
/**
 * JSON 캐시에서 title로 찾아 카드 생성 후 container에 추가
 * @param {string} title - 프로젝트 제목(정확히 일치)
 * @param {string} [containerSelector=".scroll-box"] - 붙일 컨테이너
 */
async function addCardByJson(title, containerSelector = ".scroll-box") {
  try {
    const projects = await getProjects();
    const project = projects.find(p => p.title === title);
    if (!project) {
      console.warn(`프로젝트 "${title}"를 찾을 수 없습니다.`);
      return;
    }

    // 키워드/태그 → 배지 변환 (keywoad 오타 대응 + tags 폴백)
    const words = Array.isArray(project.keywoad) && project.keywoad.length
      ? project.keywoad
      : (Array.isArray(project.tags) ? project.tags : []);

    const card = createProjectCard({
      title: project.title,
      desc: project.explanation,
      img: project.image_src,
      link: project.site,
      badges: words.map(w => ({ text: String(w), className: String(w) })),
      // 목적을 팀 표시에 재활용(원하시면 별도 필드로 바꾸세요)
      team: project.purpose
    });

    const container = document.querySelector(containerSelector);
    if (container && card) container.appendChild(card);
  } catch (err) {
    console.error("카드 생성 실패:", err);
  }
}
