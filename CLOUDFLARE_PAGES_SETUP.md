# ziwei-doushu 部署到 Cloudflare Pages 详细指南

本指南专门针对您的仓库 **github.com/sheldon6626/ziwei-doushu**（基于 Next.js 16 + React 19 的紫微斗数排盘系统）。

---

## 一、为什么需要做静态导出适配？

您的项目具有以下特点：
1. **纯客户端算法计算**：排盘、四化、安星、大限流年与古籍检索等所有核心运算均由前端浏览器（`iztro`、`lunar-javascript`）在本地毫秒级完成，**不依赖后端服务器接口**。
2. **Next.js 16 与 Cloudflare 边缘兼容性**：Next.js 16 是最新版本，旧版的 `@cloudflare/next-on-pages` 已无法直接运行 Node.js 服务端渲染。
3. **最佳部署方案：Static Export（静态导出）**：
   通过 Next.js 的 `output: 'export'` 将全站编译为纯静态 HTML/CSS/JS（生成在 `out` 目录），由 Cloudflare Pages 全球 CDN 加速分发，零服务器成本、抗百万并发、秒开访问。

---

## 二、项目已完成的代码适配改动（已在本地准备好）

为了保证 `next build` 顺利输出静态文件，已在您的本地工作区 `F:\AI\ziweidoushu` 完成以下关键调整：

1. **`next.config.js`**：
   配置 `output: 'export'`，使构建产物输出到 `out` 文件夹。
2. **`app/robots.ts` 与 `app/sitemap.ts`**：
   添加 `export const dynamic = 'force-static'`，适配静态站点的 SEO 索引生成。
3. **`app/knowledge/[star]/[topic]/page.tsx`**：
   针对开源版占位断语库，修复了 `generateStaticParams` 在空路由时的边界报错。
4. **`app/library/search/page.tsx`**：
   将古籍搜索页适配为客户端组件（`use client` + `useSearchParams` + `Suspense`），使得 `?q=关键词` 在纯静态 CDN 上依然能够实时在浏览器完成搜索。

---

## 三、提交并推送到 GitHub 仓库

请在本地终端打开该项目目录执行以下命令，将改动推送到您的 GitHub 仓库：

```bash
cd F:\AI\ziweidoushu

# 1. 查看改动
git status

# 2. 提交适配改动
git add app/ next.config.js tsconfig.json next-env.d.ts
git commit -m "fix: adapt Next.js 16 for Cloudflare Pages static export"

# 3. 推送到您的 GitHub main 分支
git push origin main
```

---

## 四、在 Cloudflare 控制台部署 Pages

当代码推送至 GitHub 后，登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)：

### 1. 创建 Pages 应用程序
1. 左侧菜单进入 **Compute (Workers) > Workers & Pages**。
2. 点击 **Create application**（创建应用程序）。
3. 切换到 **Pages** 选项卡，点击 **Connect to Git**（连接到 Git）。
4. 选择您的 GitHub 账号，授权并选中仓库 **`sheldon6626/ziwei-doushu`**。
5. 点击 **Begin setup**（开始设置）。

### 2. 构建与部署配置（关键步骤）
请在设置面板中填入以下参数：

| 配置项 | 填写值 / 选择 | 说明 |
| :--- | :--- | :--- |
| **Project name** | `ziwei-doushu` | 自定义项目名，决定默认访问前缀 |
| **Production branch** | `main` | 生产分支 |
| **Framework preset** | **None** 或 **Next.js (Static HTML Export)** | 静态预设 |
| **Build command** | `npm run build` | 构建脚本 |
| **Build output directory** | `out` | **关键**：静态导出产物目录，务必填写 `out` |

### 3. 配置环境变量（Environment Variables）
在构建设置下方的 **Environment variables** 区域点击 **Add variable**：
- **Variable name**: `NODE_VERSION`
- **Value**: `20`（或 `22`，确保 Cloudflare 构建机使用较新的 Node.js 支持 Next.js 16）

### 4. 立即部署
点击底部的 **Save and Deploy**（保存并部署）。
- Cloudflare 会自动拉取代码、安装依赖、编译生成 `out` 目录并上传至全球边缘网络。
- 构建成功后，您将获得一个专属的公网访问地址（如 `https://ziwei-doushu.pages.dev`）。

---

## 五、绑定自定义域名

1. 在 Pages 项目主页进入 **Custom domains**（自定义域）。
2. 点击 **Set up a custom domain**。
3. 输入您的独立域名（例如 `ziwei.yourdomain.com` 或根域名）。
4. 按照页面指引：
   - 若域名由 Cloudflare 托管解析：直接点击确认，系统将自动配置 DNS 与 HTTPS 证书。
   - 若域名在第三方服务商（阿里云/腾讯云等）：添加一条 CNAME 解析记录，将主机名解析到 `ziwei-doushu.pages.dev`。
