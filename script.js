const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
const glow = document.querySelector(".cursor-glow");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
});

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

const observeReveals = () => document.querySelectorAll(".reveal:not([data-observed])").forEach((element) => { element.dataset.observed = "true"; observer.observe(element); });
observeReveals();
window.addEventListener("portfolioRendered", observeReveals);

window.addEventListener("mousemove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});
