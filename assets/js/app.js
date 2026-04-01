const homeData = window.NOVEL_DATA;

const createElement = (tagName, className, textContent) => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
};

const renderHeroMeta = () => {
  const heroMeta = document.getElementById("hero-meta");
  const items = [
    ["作者", homeData.novel.author],
    ["字数", homeData.novel.wordCount],
    ["标签", homeData.novel.toneTags.join(" / ")]
  ];

  heroMeta.innerHTML = "";
  items.forEach(([label, value]) => {
    const wrapper = createElement("div");
    const dt = createElement("dt", null, label);
    const dd = createElement("dd", null, value);
    wrapper.append(dt, dd);
    heroMeta.appendChild(wrapper);
  });
};

const renderSynopsis = () => {
  const synopsis = document.getElementById("synopsis");
  synopsis.innerHTML = "";
  homeData.novel.synopsis.forEach((paragraph) => {
    synopsis.appendChild(createElement("p", null, paragraph));
  });
};

const renderReadingNotes = () => {
  const list = document.getElementById("reading-notes");
  list.innerHTML = "";
  homeData.novel.readingNotes.forEach((note) => {
    list.appendChild(createElement("li", null, note));
  });
};

const renderChapterList = () => {
  const chapterList = document.getElementById("chapter-list");
  chapterList.innerHTML = "";

  homeData.chapters.forEach((chapter) => {
    const link = createElement("a", "chapter-card");
    link.href = `reader.html?chapter=${chapter.number}`;

    const top = createElement("div", "chapter-card-top");
    top.append(
      createElement("strong", null, chapter.title),
      createElement("span", null, chapter.updateDate)
    );

    link.append(
      top,
      createElement("p", null, chapter.excerpt),
      createElement("span", "reader-chapter-index", `Chapter ${String(chapter.number).padStart(2, "0")}`)
    );

    chapterList.appendChild(link);
  });
};

const renderTimeline = () => {
  const timeline = document.getElementById("update-timeline");
  const latestChapters = [...homeData.chapters].slice(-3).reverse();
  timeline.innerHTML = "";

  latestChapters.forEach((chapter) => {
    const item = createElement("a", "timeline-item");
    item.href = `reader.html?chapter=${chapter.number}`;

    const top = createElement("div", "timeline-item-top");
    top.append(
      createElement("strong", null, chapter.title),
      createElement("span", null, chapter.updateDate)
    );

    item.append(top, createElement("p", null, chapter.excerpt));
    timeline.appendChild(item);
  });
};

const wireStaticFields = () => {
  const latestChapter = homeData.chapters[homeData.chapters.length - 1];
  const latestLink = `reader.html?chapter=${latestChapter.number}`;

  document.title = `${homeData.novel.title} | ${homeData.site.brandName}`;
  document.getElementById("brand-name").textContent = homeData.site.brandName;
  document.getElementById("novel-title").textContent = homeData.novel.title;
  document.getElementById("novel-tagline").textContent = homeData.novel.tagline;
  document.getElementById("novel-status").textContent = homeData.novel.status;
  document.getElementById("chapter-count").textContent = `${homeData.novel.totalChapters} 章`;
  document.getElementById("update-date").textContent = homeData.novel.updateDate;
  document.getElementById("novel-tags").textContent = homeData.novel.toneTags.join(" / ");
  document.getElementById("novel-quote").textContent = homeData.novel.quote;
  document.getElementById("catalog-description").textContent = `当前已更新至第 ${latestChapter.number} 章，后续可以继续无缝追加。`;
  document.getElementById("footer-copy").textContent = homeData.site.footerCopy;
  document.getElementById("latest-chapter-link").href = latestLink;
  document.getElementById("header-latest-link").href = latestLink;
  document.getElementById("footer-reader-link").href = latestLink;
};

const activateFadeIn = () => {
  const sections = document.querySelectorAll(".fade-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => observer.observe(section));
};

const initHome = () => {
  wireStaticFields();
  renderHeroMeta();
  renderSynopsis();
  renderReadingNotes();
  renderChapterList();
  renderTimeline();
  activateFadeIn();
};

initHome();
