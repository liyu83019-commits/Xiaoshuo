const releaseDates = [
  "2026-03-18",
  "2026-03-19",
  "2026-03-20",
  "2026-03-21",
  "2026-03-22",
  "2026-03-23",
  "2026-03-24",
  "2026-03-25",
  "2026-03-26",
  "2026-03-27",
  "2026-03-28",
  "2026-03-29",
  "2026-03-30",
  "2026-03-31",
  "2026-04-01"
];

const buildPlaceholderChapter = (number) => ({
  number,
  slug: `chapter-${number}`,
  title: `第${String(number).padStart(2, "0")}章 待填标题`,
  updateDate: releaseDates[number - 1] || "2026-04-01",
  excerpt: "这里会展示本章一句简短导语，用来吸引读者点进来继续阅读。",
  content: [
    `这里预留的是第 ${number} 章正文位置。你把章节内容发给我后，我会直接替换成正式文本，并保持这个页面结构不变。`,
    "如果你已经有章节标题、分段内容、更新时间或者卷名，我们也可以一并整理进去，让目录页显得更完整。",
    "当前站点已经支持目录跳转、上一篇下一篇切换，以及最新章节的自动高亮，后续继续连载会很顺手。"
  ]
});

const chapters = Array.from({ length: 15 }, (_, index) => buildPlaceholderChapter(index + 1));

window.NOVEL_DATA = {
  site: {
    brandName: "Novel Residence",
    footerCopy: "页面结构已搭好，等你把作品资料发来后，我们就能替换成正式内容。"
  },
  novel: {
    title: "作品名待填",
    tagline: "一句气质化的副标题会放在这里，用来给故事定下第一印象。",
    author: "待补充",
    status: "连载中",
    updateDate: "2026-04-01",
    totalChapters: chapters.length,
    toneTags: ["悬疑", "成长", "群像"],
    wordCount: "待补充",
    quote: "高级感不需要堆砌元素，留白、比例和节奏就足够让作品站住。",
    synopsis: [
      "这里会放小说简介。你可以把故事背景、核心设定、主角关系或者冲突主线发给我，我会整理成更适合网页展示的文案。",
      "如果你不想自己润色也没关系，直接给我原始信息就行，我可以顺手帮你把文案和页面语气统一起来。"
    ],
    readingNotes: [
      "已预留 15 章目录结构，后面继续更新时只需要追加章节数据。",
      "支持独立阅读页，读者可以直接从最新章节开始，也能从目录回看前文。",
      "页面风格目前以米白、深棕和衬线排版为核心，走克制、高级、轻文学的方向。"
    ]
  },
  chapters
};
