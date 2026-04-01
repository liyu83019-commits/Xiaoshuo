# 小说网站说明

这是一个纯静态小说网站，不依赖 Node、npm 或其他前端工具链，直接打开 `index.html` 就能看。

## 当前结构

- `index.html`：首页，展示作品信息、简介、目录和最近更新。
- `reader.html`：章节阅读页，支持上一篇、下一篇和目录跳转。
- `assets/js/novel-data.js`：小说数据入口，后续主要更新这里。
- `assets/css/styles.css`：整站视觉样式。
- `_headers`：Cloudflare Pages 缓存与响应头配置。
- `DEPLOY-CLOUDFLARE-PAGES.md`：上线到 Cloudflare Pages 的操作说明。

## 本地查看

直接双击 `index.html` 即可。

## 后续怎么更新

你之后继续发我这些内容就可以，我会直接帮你补进去：

- 作品名
- 作者名
- 简介
- 标签或风格
- 第 1 到第 15 章的标题和正文
- 后续新增章节的标题和正文

## 数据文件怎么组织

`assets/js/novel-data.js` 里已经分成两层：

- `novel`：作品基础信息
- `chapters`：章节数组

每一章都包含：

- `number`
- `title`
- `updateDate`
- `excerpt`
- `content`

其中 `content` 是段落数组，后面我会把你发来的正文自动整理成网页排版适合阅读的段落形式。

## 正式上线

如果你要让读者点链接直接访问，并且你更新后网站自动同步，请看：

- `DEPLOY-CLOUDFLARE-PAGES.md`
