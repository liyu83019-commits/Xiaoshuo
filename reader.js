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

const getChapterFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const chapterNumber = Number(params.get("chapter"));
  const chapter = readerData.chapters.find((item) => item.number === chapterNumber);
  return chapter || readerData.chapters[readerData.chapters.length - 1];
};

const renderReaderCatalog = (currentChapter) => {
  const catalog = document.getElementById("reader-catalog");
  catalog.innerHTML = "";

  readerData.chapters.forEach((chapter) => {
    const link = createReaderElement("a", "catalog-link");
    link.href = `reader.html?chapter=${chapter.number}`;
    if (chapter.number === currentChapter.number) {
      link.classList.add("active");
    }

    link.append(
      createReaderElement("span", null, `Chapter ${String(chapter.number).padStart(2, "0")}`),
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
  wireReaderFields(currentChapter);
  renderReaderContent(currentChapter);
  renderReaderCatalog(currentChapter);
  renderReaderNav(currentChapter);
  wireReadingProgress();
  activateFadeIn();
};

initReader();
