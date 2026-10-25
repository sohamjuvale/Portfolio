// Keep project information in this one array so it's easy to update.
const projects = [
  {
    name: "Quiz Web Application",
    symbol: "▣",
    status: "Verify before publishing",
    description: "An offline quiz application concept with separate student, teacher, and administrator functionality. Confirm the final features and add a repository link when ready.",
    technologies: ["C#", "ASP.NET Web Forms", "SQL Server"],
    repository: "",
    demo: ""
  },
  {
    name: "Android Application Projects",
    symbol: "▱",
    status: "In progress",
    description: "A space for Android apps built while learning Kotlin and Android Studio. Add a short description of each completed app and link only to real repositories or demos.",
    technologies: ["Kotlin", "Android Studio"],
    repository: "",
    demo: ""
  },
  {
    name: "Backend API Project",
    symbol: "{ }",
    status: "Planned",
    description: "A planned modern backend/API project. Replace this description with the actual purpose, implemented features, and setup instructions after development.",
    technologies: ["C#", "ASP.NET Core Web API", "Database TBD"],
    repository: "",
    demo: ""
  }
];

const projectsGrid = document.querySelector("#projects-grid");

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card reveal";

  const top = document.createElement("div");
  top.className = "project-top";
  const symbol = document.createElement("span");
  symbol.className = "project-symbol";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = project.symbol;
  const status = document.createElement("span");
  status.className = "project-status";
  status.textContent = project.status;
  top.append(symbol, status);

  const title = document.createElement("h3");
  title.textContent = project.name;
  const description = document.createElement("p");
  description.textContent = project.description;

  const tags = document.createElement("div");
  tags.className = "tags";
  project.technologies.forEach((technology) => {
    const tag = document.createElement("span");
    tag.textContent = technology;
    tags.append(tag);
  });

  const links = document.createElement("div");
  links.className = "project-links";
  addProjectLink(links, "Repository ↗", project.repository);
  addProjectLink(links, "Live demo ↗", project.demo);
  card.append(top, title, description, tags, links);
  return card;
}

function addProjectLink(container, label, url) {
  if (url && /^https?:\/\//i.test(url)) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    container.append(link);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "disabled-link";
    placeholder.textContent = label.replace(" ↗", " — not added");
    placeholder.setAttribute("aria-label", `${label.replace(" ↗", "")} not available yet`);
    container.append(placeholder);
  }
}

if (projectsGrid) {
  projects.forEach((project) => projectsGrid.append(createProjectCard(project)));
}

// Mobile navigation: close after selecting a section or pressing Escape.
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

function closeMenu() {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Theme preference: saved choice wins; otherwise follow the operating-system preference.
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const savedTheme = safeGetTheme();
const systemPrefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
setTheme(savedTheme || (systemPrefersLight ? "light" : "dark"));

function safeGetTheme() {
  try {
    const value = localStorage.getItem("soham-portfolio-theme");
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeToggle.title = `Switch to ${nextTheme} theme`;
  }
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "☼" : "☾";
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("soham-portfolio-theme", nextTheme);
  } catch {
    // Theme switching still works for this visit when storage is unavailable.
  }
});

// Current year stays up to date without manual edits.
const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

// Subtle reveal effect; content remains visible if IntersectionObserver is unavailable.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".skill-card, .project-card, .timeline-entry, .education-card, .github-panel").forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
