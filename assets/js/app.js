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

const getFeaturedBook = () => {
  const books = getBooks();
  const publishedBooks = books.filter((book) => book.totalChapters > 0);
  const candidates = publishedBooks.length ? publishedBooks : books;

  return candidates.sort((left, right) => {
    const dateGap = parseDateValue(right.updateDate) - parseDateValue(left.updateDate);
    if (dateGap !== 0) {
      return dateGap;
    }
    return (right.totalChapters || 0) - (left.totalChapters || 0);
  })[0];
};

const setLinkHref = (id, href) => {
  const element = document.getElementById(id);
  if (element && href) {
    element.href = href;
  }
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

  document.getElementById("feature-copy").textContent = featuredBook.summary;
  document.getElementById("activity-copy").textContent = `${featuredBook.title} 目前是首页主推，点击即可直接进入对应作品页。`;
  document.getElementById("feature-link").textContent = `进入《${featuredBook.title}》`;

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
    const item = createElement("div");
    item.append(
      createElement("span", null, label),
      createElement("strong", "library-stat-value", value)
    );
    statRoot.appendChild(item);
  });
};

const createCoverNode = (book) => {
  const frame = createElement("div", "shelf-cover");

  if (book.coverImage) {
    const image = createElement("img");
    image.src = book.coverImage;
    image.alt = book.coverAlt || `${book.title} 封面`;
    frame.appendChild(image);
    return frame;
  }

  const fallback = createElement("div", "shelf-cover-fallback", book.coverFallback || "新书");
  frame.appendChild(fallback);
  return frame;
};

const renderBookshelf = () => {
  const shelfRoot = document.getElementById("bookshelf-grid");
  const books = getBooks();
  shelfRoot.innerHTML = "";

  books.forEach((book) => {
    const card = createElement("a", "shelf-card");
    card.href = book.href || "#";
    if (book.openInNewTab) {
      card.target = "_blank";
      card.rel = "noreferrer";
    }

    const content = createElement("div", "shelf-content");
    const top = createElement("div", "shelf-top");
    const heading = createElement("div", "shelf-heading");
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
    content.append(top, meta, summary, tags, footer);
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
  const books = getBooks().sort((left, right) => parseDateValue(right.updateDate) - parseDateValue(left.updateDate));
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
      createElement("p", null, `${book.progressText || "待更新"} · ${book.status}`)
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
