# Cloudflare Pages 上线说明

这个项目已经是纯静态网站，适合直接部署到 Cloudflare Pages。

## 你要做的事

1. 注册 GitHub 账号
2. 注册 Cloudflare 账号
3. 把当前项目上传到 GitHub 仓库
4. 在 Cloudflare Pages 里连接这个仓库
5. 以后每次更新小说，都把改动提交到 GitHub
6. Cloudflare 会自动重新发布网站

## 第一步：创建 GitHub 仓库

建议仓库名直接用英文，例如：

- `novel-site`
- `my-novel`
- `serial-fiction`

创建完成后，把这个文件夹里的全部内容上传上去：

- `index.html`
- `reader.html`
- `assets`
- `_headers`
- `README.md`
- `DEPLOY-CLOUDFLARE-PAGES.md`

如果你不会用 Git 命令也没关系，可以直接用 GitHub 网页上传文件。

## 第二步：连接 Cloudflare Pages

登录 Cloudflare 后：

1. 进入 `Workers & Pages`
2. 点击 `Create application`
3. 选择 `Pages`
4. 选择 `Connect to Git`
5. 授权 GitHub
6. 选中你刚刚创建的仓库

## 第三步：部署设置

这个项目没有构建工具，按静态站配置即可。

- Production branch：`main`
- Build command：留空；如果界面必须填写，可以填 `exit 0`
- Build output directory：`/`
- Root directory：留空

部署完成后，Cloudflare 会给你一个：

- `https://你的项目名.pages.dev`

这个链接就可以直接发给读者。

## 第四步：后续更新小说

你后面每次更新章节时，主要改这个文件：

- `assets/js/novel-data.js`

如果是我来帮你更新，你只要把这些内容发给我就行：

- 新章节标题
- 新章节正文
- 更新时间
- 如果有摘要，也可以一起给我

我改完后，你再把更新后的项目内容上传到 GitHub 仓库。
只要仓库一更新，Cloudflare Pages 就会自动重新部署。

## 读者什么时候能看到更新

当前项目根目录已经加了 `_headers` 文件，用来降低缓存干扰。

这意味着：

- 你更新并发布后
- 读者刷新页面
- 一般就能看到最新章节

## 如果你想用自己的域名

例如：

- `www.xxx.com`
- `novel.xxx.com`

Cloudflare Pages 后面可以直接绑定自定义域名。

## 最适合你的更新方式

如果你不想自己碰代码，最省事的流程是：

1. 你把新章节发给我
2. 我帮你更新这个项目
3. 你把改好的文件重新上传到 GitHub
4. 网站自动发布

这样你不用自己改网页结构，只需要持续提供小说内容。
