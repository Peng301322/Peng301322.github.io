const app = document.querySelector("#app");
const { siteData } = window;

const renderButtons = (links, className = "button") =>
  links
    .map(
      (link) =>
        `<a class="${className}" href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>`
    )
    .join("");

const renderChips = (items) =>
  items.map((item) => `<span class="chip">${item}</span>`).join("");

const renderMeta = (items) =>
  items.filter(Boolean).map((item) => `<span>${item}</span>`).join("");

app.innerHTML = `
  <section class="hero" id="top">
    <div class="hero-copy">
      <p class="eyebrow">AI PRODUCT MANAGER / PERSONAL OPERATING SYSTEM</p>
      <h1>${siteData.profile.name}</h1>
      <p class="hero-role">${siteData.profile.role}</p>
      <p class="hero-intro">${siteData.profile.intro}</p>
      <div class="hero-meta">
        ${renderMeta([siteData.profile.phone, siteData.profile.email])}
      </div>
      <div class="button-row">
        ${renderButtons(siteData.profile.links)}
      </div>
    </div>
    <div class="hero-photo-card">
      <img
        class="hero-photo"
        src="${siteData.profile.photo.src}"
        alt="${siteData.profile.photo.alt}"
      >
    </div>
    <div class="hero-insights">
      <div class="hero-card">
        <span class="card-kicker">Personal Positioning</span>
        <h2>把复杂业务翻译成可落地产品</h2>
        <ul class="summary-list">
          ${siteData.profile.summary.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="stat-grid">
        ${siteData.heroStats
          .map(
            (stat) => `
              <article class="stat-card">
                <strong>${stat.value}</strong>
                <span>${stat.label}</span>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section" id="positioning">
    <div class="section-head">
      <p class="eyebrow">01 / Positioning</p>
      <h2>我的产品化标签</h2>
    </div>
    <div class="feature-grid">
      ${siteData.positioning
        .map(
          (item) => `
            <article class="feature-card">
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  </section>

  <section class="section" id="background">
    <div class="section-head">
      <p class="eyebrow">02 / Background</p>
      <h2>教育与基础信息</h2>
    </div>
    <div class="education-grid">
      ${siteData.education
        .map(
          (item) => `
            <article class="education-card">
              <h3>${item.school}</h3>
              <p>${item.degree}</p>
              <span>${item.major}</span>
            </article>
          `
        )
        .join("")}
    </div>
    <div class="info-grid">
      ${siteData.backgroundFacts
        .map(
          (item) => `
            <article class="info-card">
              <span class="card-kicker">${item.title}</span>
              <p>${item.content}</p>
            </article>
          `
        )
        .join("")}
    </div>
    <div class="coursework-block">
      <div class="coursework-head">
        <span class="card-kicker">Core Coursework</span>
        <h3>核心课程及成绩</h3>
      </div>
      <div class="coursework-grid">
        ${siteData.coreCourses
          .map(
            (course) => `
              <article class="course-card">
                <strong>${course.name}</strong>
                <span>${course.score}</span>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section" id="experience">
    <div class="section-head">
      <p class="eyebrow">03 / Experience</p>
      <h2>实习经历与关键成果</h2>
    </div>
    <div class="experience-stack">
      ${siteData.experience
        .map(
          (item) => `
            <article class="experience-card">
              <div class="timeline-top">
                <div>
                  <p class="timeline-company">${item.company}</p>
                  <h3>${item.title}</h3>
                </div>
                <span class="timeline-period">${item.period}</span>
              </div>
              <p class="timeline-highlight">${item.headline}</p>
              <div class="chip-row">
                ${renderChips(item.tags)}
              </div>
              <div class="experience-grid">
                <div class="experience-column">
                  <h4>关键结果</h4>
                  <ul class="detail-list">
                    ${item.wins.map((win) => `<li>${win}</li>`).join("")}
                  </ul>
                </div>
                <div class="experience-column">
                  <h4>负责模块</h4>
                  <div class="experience-module-grid">
                    ${item.modules
                      .map(
                        (module) => `
                          <article class="experience-module">
                            <h5>${module.title}</h5>
                            <p>${module.detail}</p>
                          </article>
                        `
                      )
                      .join("")}
                  </div>
                </div>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  </section>

  <section class="section portfolio-section" id="portfolio">
    <div class="section-head">
      <p class="eyebrow">04 / Portfolio</p>
      <h2>作品展示区</h2>
    </div>
    <div class="portfolio-grid">
      ${siteData.portfolioProjects
        .map(
          (item) => `
            <article class="portfolio-card">
              <div class="portfolio-top">
                <div>
                  <p class="portfolio-state">${item.type}</p>
                  <h3>${item.title}</h3>
                </div>
              </div>
              <p class="portfolio-tagline">${item.tagline}</p>
              <p>${item.summary}</p>
              <div class="portfolio-block">
                <h4>我负责什么</h4>
                <p>${item.role}</p>
              </div>
              <div class="portfolio-block">
                <h4>项目亮点</h4>
                <ul class="detail-list">
                  ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
                </ul>
              </div>
              ${
                item.gallery?.length
                  ? `
                    <div class="portfolio-block">
                      <h4>图片摘要</h4>
                      <div class="project-gallery">
                        ${item.gallery
                          .map(
                            (image) => `
                              <figure class="project-shot">
                                <img
                                  class="${image.className || ""}"
                                  src="${image.src}"
                                  alt="${image.alt}"
                                  style="${image.position ? `object-position:${image.position};` : ""}"
                                >
                                <figcaption>${image.caption}</figcaption>
                              </figure>
                            `
                          )
                          .join("")}
                      </div>
                    </div>
                  `
                  : ""
              }
              <div class="button-row">
                ${renderButtons(item.files, "button button-muted")}
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  </section>

  <section class="section split-section" id="awards">
    <div class="split-card">
      <div class="section-head">
        <p class="eyebrow">05 / Recognition</p>
        <h2>奖项与成果</h2>
      </div>
      <ul class="detail-list">
        ${siteData.awards.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
    <div class="split-card">
      <div class="section-head">
        <p class="eyebrow">06 / Skill Stack</p>
        <h2>技能栈与产品观</h2>
      </div>
      <div class="tag-cloud">
        ${siteData.skills.map((item) => `<span>${item}</span>`).join("")}
      </div>
      <div class="principles">
        <h3>产品观</h3>
        <ul class="detail-list">
          ${siteData.principles.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  </section>
  <a class="floating-resume" href="./assets/resume-latest.pdf" target="_blank" rel="noreferrer">
    下载简历
  </a>
`;

const header = document.querySelector(".site-header");
const navButtons = document.querySelectorAll("[data-target]");
const sectionIds = ["top", "positioning", "background", "experience", "portfolio", "awards"];
const navLinks = document.querySelectorAll(".site-nav .nav-link");

const getScrollOffset = () => {
  const headerHeight = header ? header.offsetHeight : 0;
  return headerHeight + 20;
};

const getSectionById = (id) => document.getElementById(id);

const setActiveNav = (id) => {
  navLinks.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === id);
  });
};

const scrollToSection = (id, smooth = true) => {
  const target = getSectionById(id);

  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: smooth ? "smooth" : "auto"
  });
};

const syncActiveNav = () => {
  const scrollAnchor = window.scrollY + getScrollOffset() + 24;
  let activeId = "top";

  sectionIds.forEach((id) => {
    const section = getSectionById(id);

    if (section && section.offsetTop <= scrollAnchor) {
      activeId = id;
    }
  });

  setActiveNav(activeId);
};

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { target } = button.dataset;

    if (!target) return;

    setActiveNav(target);
    scrollToSection(target);
  });
});

window.addEventListener("scroll", syncActiveNav, { passive: true });

window.addEventListener("load", () => {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  syncActiveNav();
});

const loadAnalytics = () => {
  const analytics = siteData.analytics || {};

  if (analytics.provider === "clarity" && analytics.clarityId) {
    const script = document.createElement("script");

    script.text = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${analytics.clarityId}");
    `;
    document.head.appendChild(script);
  }

  if (analytics.provider === "umami" && analytics.umamiSrc && analytics.websiteId) {
    const script = document.createElement("script");

    script.defer = true;
    script.src = analytics.umamiSrc;
    script.dataset.websiteId = analytics.websiteId;
    document.head.appendChild(script);
  }
};

loadAnalytics();
