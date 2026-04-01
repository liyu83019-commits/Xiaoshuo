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

const HISTORY_STORAGE_KEY = `novel-history:${homeData.novel.title}`;
const HISTORY_LIMIT = 8;

const formatChapterIndex = (chapterNumber) => `Chapter ${String(chapterNumber).padStart(2, "0")}`;

const buildChapterSearchText = (chapter) =>
  [
    chapter.number,
    `第${chapter.number}章`,
    chapter.title,
    chapter.excerpt,
    ...(chapter.content || [])
  ]
    .join(" ")
    .toLowerCase();

const getFilteredChapters = (query) => {
  const keyword = query.trim().toLowerCase();
  if (!keyword) {
    return homeData.chapters;
  }

  return homeData.chapters.filter((chapter) => buildChapterSearchText(chapter).includes(keyword));
};

const readViewingHistory = () => {
  try {
    const rawHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsedHistory = rawHistory ? JSON.parse(rawHistory) : [];
    return Array.isArray(parsedHistory) ? parsedHistory.slice(0, HISTORY_LIMIT) : [];
  } catch (error) {
    return [];
  }
};

const renderViewingHistory = () => {
  const historyList = document.getElementById("home-history-list");
  const historyEmpty = document.getElementById("home-history-empty");
  const historyCount = document.getElementById("home-history-count");
  const history = readViewingHistory();

  historyCount.textContent = String(history.length);
  historyList.innerHTML = "";
  historyEmpty.hidden = history.length !== 0;

  history.forEach((record) => {
    const link = createElement("a", "history-entry");
    link.href = `reader.html?chapter=${record.number}`;

    const top = createElement("div", "history-entry-top");
    top.append(
      createElement("strong", null, record.title),
      createElement("span", null, `第 ${record.number} 章`)
    );

    link.append(top, createElement("p", null, record.visitedLabel || "最近阅读"));
    historyList.appendChild(link);
  });
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

const renderChapterList = (chapters = homeData.chapters) => {
  const chapterList = document.getElementById("chapter-list");
  chapterList.innerHTML = "";

  chapters.forEach((chapter) => {
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
      createElement("span", "reader-chapter-index", formatChapterIndex(chapter.number))
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

const updateHomeSearchSummary = (visibleCount, query) => {
  const summary = document.getElementById("home-search-summary");
  summary.textContent = query.trim() ? `找到 ${visibleCount} 章` : `共 ${homeData.chapters.length} 章`;
};

const toggleHomeSearchEmpty = (isEmpty) => {
  document.getElementById("home-search-empty").hidden = !isEmpty;
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
  document.getElementById("novel-cover").src = homeData.novel.coverImage;
  document.getElementById("novel-cover").alt = homeData.novel.coverAlt;
  document.getElementById("catalog-description").textContent = `当前已更新至第 ${latestChapter.number} 章，后续可以继续无缝追加。`;
  document.getElementById("footer-copy").textContent = homeData.site.footerCopy;
  document.getElementById("latest-chapter-link").href = latestLink;
  document.getElementById("header-latest-link").href = latestLink;
  document.getElementById("footer-reader-link").href = latestLink;
};

const wireHomeSearch = () => {
  const searchInput = document.getElementById("home-chapter-search");

  const applySearch = () => {
    const filteredChapters = getFilteredChapters(searchInput.value);
    renderChapterList(filteredChapters);
    updateHomeSearchSummary(filteredChapters.length, searchInput.value);
    toggleHomeSearchEmpty(filteredChapters.length === 0);
  };

  searchInput.addEventListener("input", applySearch);
  searchInput.addEventListener("search", applySearch);
  applySearch();
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
  renderTimeline();
  renderViewingHistory();
  wireHomeSearch();
  activateFadeIn();
};

initHome();
