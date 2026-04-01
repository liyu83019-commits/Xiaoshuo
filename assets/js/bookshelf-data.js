window.BOOKSHELF_DATA = {
  site: {
    brandName: "知微书舍",
    brandSubtitle: "Serial Fiction Bookshelf",
    homeEyebrow: "Bookshelf",
    homeHeading: "先挑书，再进入对应作品页。",
    homeDescription:
      "首页现在作为整站书架入口使用，适合同时承接多本小说。每张卡片都可以跳到不同链接，后面继续加书也不用重做首页。",
    bookshelfDescription:
      "当前先收纳已上线作品和第二本书的预留入口，后续新增小说时直接追加卡片即可。",
    footerCopy:
      "首页已改为书架模式。第一本书可直接阅读，第二本书入口也已预留。",
    publishingNotes: [
      "以后新增作品时，只要在 `assets/js/bookshelf-data.js` 里追加一本书的数据即可。",
      "每本书都可以配置单独链接，既可以跳站内页面，也可以跳到独立域名。",
      "当前这本民国文继续保留在 `reader.html`，不影响后续追加章节。"
    ]
  },
  books: [
    {
      id: "shaoshuai",
      title: "穿到民国第一夜，我被少帅盯上了",
      author: "Frank",
      status: "连载中",
      updateDate: "2026-04-22",
      totalChapters: 39,
      wordCount: "约 9.5 万字",
      tags: ["民国", "悬疑", "真假千金", "少帅"],
      badge: "已上线",
      progressText: "已更新至第39章",
      summary:
        "一夜穿进民国名门，她要借少帅的势活下去，也要顺着枪火与旧案，把被偷走的人生一点点夺回来。",
      coverImage: "assets/images/book-cover.png",
      coverAlt: "《穿到民国第一夜，我被少帅盯上了》封面图",
      href: "reader.html?chapter=39",
      ctaLabel: "进入阅读"
    },
    {
      id: "next-book",
      title: "第二本书筹备中",
      author: "Frank",
      status: "筹备中",
      updateDate: "待公布",
      totalChapters: 0,
      wordCount: "待更新",
      tags: ["新书", "预留入口", "待上架"],
      badge: "占位中",
      progressText: "新书入口已预留",
      summary:
        "这张卡片是给第二本书预留的。后面你把书名、简介、封面和链接替换掉，它就能直接成为新的作品入口。",
      coverFallback: "新书",
      href: "coming-soon.html",
      ctaLabel: "查看占位页"
    }
  ]
};
