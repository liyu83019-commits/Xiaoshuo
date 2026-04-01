const bookshelfData = window.BOOKSHELF_DATA;

const createElement = (tagName, className, textContent) => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (typeof textContent === "string") {
    element.textContent = textContent;
  }
  return element;
};

const parseDateValue = (value) => {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getBooks = () => (Array.isArray(bookshelfData?.books) ? bookshelfData.books.slice() : []);

const getSortedBooks = () =>
  getBooks().sort((left, right) => {
    const dateGap = parseDateValue(right.updateDate) - parseDateValue(left.updateDate);
    if (dateGap !== 0) {
      return dateGap;
    }
    return (right.totalChapters || 0) - (left.totalChapters || 0);
  });

const getFeaturedBook = () => {
  const books = getSortedBooks();
  const publishedBooks = books.filter((book) => book.totalChapters > 0);
  const candidates = publishedBooks.length ? publishedBooks : books;
  return candidates[0];
};

const setLinkHref = (id, href) => {
  const element = document.getElementById(id);
  if (element && href) {
    element.href = href;
  }
};

const renderHeroMarquee = () => {
  const marqueeRoot = document.getElementById("hero-marquee");
  const sitePills = Array.isArray(bookshelfData.site.heroPills) ? bookshelfData.site.heroPills : [];
  const tagPills = getBooks().flatMap((book) => book.tags || []);
  const pills = [...new Set([...sitePills, ...tagPills])].slice(0, 9);

  marqueeRoot.innerHTML = "";
  pills.forEach((pill) => {
    marqueeRoot.appendChild(createElement("span", "hero-pill", pill));
  });
};

const renderHeroGlance = (featuredBook) => {
  const glanceRoot = document.getElementById("hero-glance");
  const books = getBooks();
  const publishedCount = books.filter((book) => book.totalChapters > 0).length;
  const upcomingCount = books.length - publishedCount;
  const glanceItems = [
    ["连载追更", `${publishedCount} 本已开放阅读`],
    ["新书动静", upcomingCount > 0 ? `${upcomingCount} 本即将上架` : "更多故事正在路上"],
    ["今夜主推", featuredBook ? `《${featuredBook.title}》` : "敬请期待"]
  ];

  glanceRoot.innerHTML = "";
  glanceItems.forEach(([label, value]) => {
    const item = createElement("div", "hero-glance-item");
    item.append(
      createElement("span", null, label),
      createElement("strong", null, value)
    );
    glanceRoot.appendChild(item);
  });
};

const createCoverNode = (book, coverClassName = "shelf-cover", fallbackClassName = "shelf-cover-fallback") => {
  const frame = createElement("div", coverClassName);

  if (book.coverImage) {
    const image = createElement("img");
    image.src = book.coverImage;
    image.alt = book.coverAlt || `${book.title} 封面`;
    frame.appendChild(image);
    return frame;
  }

  const fallback = createElement("div", fallbackClassName, book.coverFallback || "新书");
  frame.appendChild(fallback);
  return frame;
};

const renderFeatureBook = (featuredBook) => {
  if (!featuredBook) {
    return;
  }

  const coverRoot = document.getElementById("feature-cover");
  const tagsRoot = document.getElementById("feature-tags");
  document.getElementById("feature-kicker").textContent =
    featuredBook.featureKicker || featuredBook.progressText || "今晚主推";
  document.getElementById("feature-title").textContent = featuredBook.title;
  document.getElementById("feature-meta").textContent = [
    `作者 ${featuredBook.author}`,
    featuredBook.status,
    featuredBook.totalChapters > 0 ? `${featuredBook.totalChapters} 章` : "即将开放",
    featuredBook.updateDate
  ].join(" · ");

  coverRoot.innerHTML = "";
  coverRoot.appendChild(createCoverNode(featuredBook, "feature-cover-frame", "feature-cover-fallback"));

  tagsRoot.innerHTML = "";
  (featuredBook.tags || []).slice(0, 4).forEach((tag) => {
    tagsRoot.appendChild(createElement("span", null, tag));
  });
};

const renderHeaderAndHero = (featuredBook) => {
  document.title = `${bookshelfData.site.brandName} | 书架`;
  document.getElementById("brand-name").textContent = bookshelfData.site.brandName;
  document.getElementById("brand-subtitle").textContent = bookshelfData.site.brandSubtitle;
  document.getElementById("home-eyebrow").textContent = bookshelfData.site.homeEyebrow;
  document.getElementById("home-heading").textContent = bookshelfData.site.homeHeading;
  document.getElementById("home-description").textContent = bookshelfData.site.homeDescription;
  document.getElementById("bookshelf-description").textContent = bookshelfData.site.bookshelfDescription;
  document.getElementById("footer-copy").textContent = bookshelfData.site.footerCopy;

  if (!featuredBook) {
    return;
  }

  renderHeroMarquee();
  renderHeroGlance(featuredBook);
  renderFeatureBook(featuredBook);
  document.getElementById("feature-copy").textContent = featuredBook.summary;
  document.getElementById("activity-copy").textContent = `最近书架里最热的动静来自《${featuredBook.title}》，如果你喜欢强情节和持续推进的故事线，可以直接从这里进入。`;
  document.getElementById("feature-link").textContent = `今夜就读《${featuredBook.title}》`;

  setLinkHref("header-feature-link", featuredBook.href);
  setLinkHref("hero-feature-link", featuredBook.href);
  setLinkHref("feature-link", featuredBook.href);
  setLinkHref("footer-feature-link", featuredBook.href);
};

const renderLibraryStats = (featuredBook) => {
  const statRoot = document.getElementById("library-stats");
  const books = getBooks();
  const publishedCount = books.filter((book) => book.totalChapters > 0).length;
  const totalBooks = books.length;
  const totalChapters = books.reduce((sum, book) => sum + (book.totalChapters || 0), 0);
  const stats = [
    ["书架作品", `${totalBooks} 本`],
    ["已上线", `${publishedCount} 本`],
    ["当前总章数", `${totalChapters} 章`],
    ["最近更新", featuredBook?.updateDate || "待更新"]
  ];

  statRoot.innerHTML = "";
  stats.forEach(([label, value]) => {
    const item = createElement("div", "library-stat-card");
    item.append(
      createElement("span", null, label),
      createElement("strong", "library-stat-value", value)
    );
    statRoot.appendChild(item);
  });
};

const renderBookshelf = () => {
  const shelfRoot = document.getElementById("bookshelf-grid");
  const books = getSortedBooks();
  shelfRoot.innerHTML = "";

  books.forEach((book, index) => {
    const card = createElement("a", "shelf-card");
    card.href = book.href || "#";
    if (book.openInNewTab) {
      card.target = "_blank";
      card.rel = "noreferrer";
    }

    const content = createElement("div", "shelf-content");
    const serial = createElement("span", "shelf-serial", `No.${String(index + 1).padStart(2, "0")}`);
    const top = createElement("div", "shelf-top");
    const heading = createElement("div", "shelf-heading");
    const lead = createElement("p", "shelf-lead", book.featureKicker || book.progressText || book.status);
    const title = createElement("h3", null, book.title);
    const author = createElement("p", "shelf-author", `作者 · ${book.author}`);
    const badge = createElement("span", "shelf-badge", book.badge || book.status);
    const summary = createElement("p", "shelf-summary", book.summary);
    const meta = createElement("div", "shelf-meta");
    const tags = createElement("div", "shelf-tags");
    const footer = createElement("div", "shelf-footer");
    const progress = createElement("span", "shelf-progress", book.progressText || "待更新");
    const cta = createElement("span", "shelf-cta", book.ctaLabel || "进入作品");

    heading.append(title, author);
    top.append(heading, badge);

    [
      book.status,
      book.totalChapters > 0 ? `共 ${book.totalChapters} 章` : "章节待添加",
      book.wordCount,
      `更新 ${book.updateDate}`
    ].forEach((item) => {
      meta.appendChild(createElement("span", null, item));
    });

    (book.tags || []).forEach((tag) => {
      tags.appendChild(createElement("span", null, tag));
    });

    footer.append(progress, cta);
    content.append(serial, top, lead, meta, summary, tags, footer);
    card.append(createCoverNode(book), content);
    shelfRoot.appendChild(card);
  });
};

const renderPublishingNotes = () => {
  const notesRoot = document.getElementById("publishing-notes-list");
  notesRoot.innerHTML = "";

  bookshelfData.site.publishingNotes.forEach((note) => {
    notesRoot.appendChild(createElement("li", null, note));
  });
};

const renderActivity = () => {
  const activityRoot = document.getElementById("bookshelf-activity");
  const books = getSortedBooks();
  activityRoot.innerHTML = "";

  books.forEach((book) => {
    const item = createElement("a", "timeline-item shelf-activity-item");
    item.href = book.href || "#";
    if (book.openInNewTab) {
      item.target = "_blank";
      item.rel = "noreferrer";
    }

    const top = createElement("div", "timeline-item-top");
    top.append(
      createElement("strong", null, book.title),
      createElement("span", null, book.updateDate)
    );

    item.append(
      top,
      createElement(
        "p",
        null,
        book.totalChapters > 0
          ? `${book.progressText || "待更新"}，最近一次更新在 ${book.updateDate}。`
          : `${book.progressText || "待更新"}，更多信息会在上架时同步公开。`
      )
    );
    activityRoot.appendChild(item);
  });
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
  if (!bookshelfData || !bookshelfData.site) {
    return;
  }

  const featuredBook = getFeaturedBook();
  renderHeaderAndHero(featuredBook);
  renderLibraryStats(featuredBook);
  renderBookshelf();
  renderPublishingNotes();
  renderActivity();
  activateFadeIn();
};

initHome();
