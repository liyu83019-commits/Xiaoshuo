const readerData = window.NOVEL_DATA;

const createReaderElement = (tagName, className, textContent) => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
};

const HISTORY_STORAGE_KEY = `novel-history:${readerData.novel.title}`;
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
    return readerData.chapters;
  }

  return readerData.chapters.filter((chapter) => buildChapterSearchText(chapter).includes(keyword));
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

const saveViewingHistory = (currentChapter) => {
  const nextRecord = {
    number: currentChapter.number,
    title: currentChapter.title,
    visitedAt: Date.now(),
    visitedLabel: `阅读于 ${new Date().toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })}`
  };

  const nextHistory = [
    nextRecord,
    ...readViewingHistory().filter((record) => record.number !== currentChapter.number)
  ].slice(0, HISTORY_LIMIT);

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  } catch (error) {
    return;
  }
};

const renderViewingHistory = () => {
  const historyList = document.getElementById("reader-history-list");
  const historyEmpty = document.getElementById("reader-history-empty");
  const historyCount = document.getElementById("reader-history-count");
  const history = readViewingHistory();

  historyCount.textContent = String(history.length);
  historyList.innerHTML = "";
  historyEmpty.hidden = history.length !== 0;

  history.forEach((record) => {
    const link = createReaderElement("a", "history-entry");
    link.href = `reader.html?chapter=${record.number}`;

    const top = createReaderElement("div", "history-entry-top");
    top.append(
      createReaderElement("strong", null, record.title),
      createReaderElement("span", null, `第 ${record.number} 章`)
    );

    link.append(top, createReaderElement("p", null, record.visitedLabel || "最近阅读"));
    historyList.appendChild(link);
  });
};

const getChapterFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const chapterNumber = Number(params.get("chapter"));
  const chapter = readerData.chapters.find((item) => item.number === chapterNumber);
  return chapter || readerData.chapters[readerData.chapters.length - 1];
};

const renderReaderCatalog = (currentChapter, chapters = readerData.chapters) => {
  const catalog = document.getElementById("reader-catalog");
  catalog.innerHTML = "";

  chapters.forEach((chapter) => {
    const link = createReaderElement("a", "catalog-link");
    link.href = `reader.html?chapter=${chapter.number}`;
    if (chapter.number === currentChapter.number) {
      link.classList.add("active");
    }

    link.append(
      createReaderElement("span", null, formatChapterIndex(chapter.number)),
      createReaderElement("strong", null, chapter.title),
      createReaderElement("span", null, chapter.updateDate)
    );

    catalog.appendChild(link);
  });
};

const renderReaderContent = (currentChapter) => {
  const chapterContent = document.getElementById("chapter-content");
  chapterContent.innerHTML = "";
  chapterContent.classList.remove("is-loading");

  currentChapter.content.forEach((paragraph) => {
    chapterContent.appendChild(createReaderElement("p", null, paragraph));
  });
};

const renderReaderNav = (currentChapter) => {
  const nav = document.getElementById("reader-nav");
  const previous = readerData.chapters.find((chapter) => chapter.number === currentChapter.number - 1);
  const next = readerData.chapters.find((chapter) => chapter.number === currentChapter.number + 1);

  const prevLink = createReaderElement("a", "reader-nav-link", previous ? "上一篇" : "已经是第一章");
  prevLink.href = previous ? `reader.html?chapter=${previous.number}` : "#";
  if (!previous) {
    prevLink.classList.add("disabled");
  }

  const homeLink = createReaderElement("a", "reader-nav-link", "回到目录");
  homeLink.href = "index.html#catalog";

  const nextLink = createReaderElement("a", "reader-nav-link", next ? "下一篇" : "等待更新");
  nextLink.href = next ? `reader.html?chapter=${next.number}` : "#";
  if (!next) {
    nextLink.classList.add("disabled");
  }

  nav.innerHTML = "";
  nav.append(prevLink, homeLink, nextLink);
};

const wireReaderFields = (currentChapter) => {
  document.title = `${currentChapter.title} | ${readerData.novel.title}`;
  document.getElementById("reader-site-title").textContent = readerData.novel.title;
  document.getElementById("reader-chapter-title").textContent = currentChapter.title;
  document.getElementById("reader-header-meta").textContent = `${readerData.novel.status} · 更新至第 ${readerData.novel.totalChapters} 章`;
  document.getElementById("reader-chapter-label").textContent = `Chapter ${String(currentChapter.number).padStart(2, "0")}`;
  document.getElementById("reader-article-title").textContent = currentChapter.title;
  document.getElementById("reader-article-meta").textContent = `更新于 ${currentChapter.updateDate}`;
};

const updateReaderSearchSummary = (visibleCount, query) => {
  const summary = document.getElementById("reader-search-summary");
  summary.textContent = query.trim() ? `找到 ${visibleCount} 章` : `共 ${readerData.chapters.length} 章`;
};

const toggleReaderSearchEmpty = (isEmpty) => {
  document.getElementById("reader-search-empty").hidden = !isEmpty;
};

const wireReaderSearch = (currentChapter) => {
  const searchInput = document.getElementById("reader-chapter-search");

  const applySearch = () => {
    const filteredChapters = getFilteredChapters(searchInput.value);
    renderReaderCatalog(currentChapter, filteredChapters);
    updateReaderSearchSummary(filteredChapters.length, searchInput.value);
    toggleReaderSearchEmpty(filteredChapters.length === 0);
  };

  searchInput.addEventListener("input", applySearch);
  searchInput.addEventListener("search", applySearch);
  applySearch();
};

const wireReadingProgress = () => {
  const progressBar = document.getElementById("reading-progress-bar");
  const chapterContent = document.getElementById("chapter-content");
  const isSplitScroll = () => window.matchMedia("(min-width: 981px)").matches;

  const updateProgress = () => {
    const scrollTop = isSplitScroll() ? chapterContent.scrollTop : window.scrollY;
    const scrollableHeight = isSplitScroll()
      ? chapterContent.scrollHeight - chapterContent.clientHeight
      : document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  chapterContent.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();
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

const initReader = () => {
  const currentChapter = getChapterFromQuery();
  saveViewingHistory(currentChapter);
  wireReaderFields(currentChapter);
  renderReaderContent(currentChapter);
  renderReaderNav(currentChapter);
  renderViewingHistory();
  wireReaderSearch(currentChapter);
  wireReadingProgress();
  activateFadeIn();
};

initReader();
