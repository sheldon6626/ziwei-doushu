# Cloudflare 关联 GitHub 仓库与自定义域名配置全指南

本文档专门针对紫微斗数（ziweidoushu）项目，指导如何通过 **Cloudflare 控制台（Dashboard）** 直接连接 GitHub 远程仓库实现自动化构建部署（CI/CD），并配置自定义域名与免费 HTTPS 证书。

---

## 一、前置准备清单

1. **GitHub 账号与代码仓库**：
   - 项目代码已推送到 GitHub（私有仓库或公开仓库均可）。
2. **Cloudflare 账号**：
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com/) 注册并登录。
3. **域名（可选）**：
   - 若需绑定自有域名，需准备好域名；域名可在 Cloudflare 购买托管，也可保留在原注册商（阿里云、腾讯云、GoDaddy、Namecheap 等）。
   - 如果暂时没有域名，Cloudflare 会免费赠送一个专属的二级域名（形如 `xxx.pages.dev`），支持全球访问并自带 HTTPS。

---

## 二、通过控制台连接 GitHub 仓库（Cloudflare Pages）

Cloudflare Pages 是托管前端单页应用（SPA）、静态站点及现代全栈框架（Next.js / Astro / Vue / React 等）最便捷的原生方案。

### 步骤 1：进入 Pages 管理面板
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 在左侧导航栏点击 **Compute (Workers) > Workers & Pages**（或旧版界面的 **Workers 与 Pages**）。
3. 点击页面中的 **Create**（创建）按钮，然后切换选项卡到 **Pages**。
4. 选择 **Connect to Git**（连接到 Git）。

### 步骤 2：授权与关联 GitHub 仓库
1. 点击 **Connect GitHub**（首次使用需授权 Cloudflare 访问您的 GitHub 账号）。
2. 在弹出的 GitHub 授权窗口中：
   - 选择授权的账号/组织；
   - 权限范围建议选择 **Only select repositories**（仅所选仓库），并勾选您的 `ziweidoushu` 仓库；
   - 点击 **Install & Authorize**。
3. 授权成功后返回 Cloudflare，在仓库列表中勾选您的紫微斗数仓库，点击 **Begin setup**（开始设置）。

### 步骤 3：配置构建命令与输出路径
在 **Set up builds and deployments**（设置构建与部署）页面：

1. **Project name（项目名称）**：默认为仓库名称，可自定义，该名称将决定默认访问域名（如 `ziweidoushu.pages.dev`）。
2. **Production branch（生产分支）**：通常保持为 `main` 或 `master`。
3. **Framework preset（框架预设）**：根据项目技术栈选择对应预设，常见配置如下：

| 项目技术栈 | Framework preset 预设 | Build command (构建命令) | Build output directory (输出目录) |
| :--- | :--- | :--- | :--- |
| **纯静态 HTML/CSS/JS** | None | *(留空)* | `/` 或 `.` (根目录) |
| **Vite + React / Vue** | Vite | `npm run build` | `dist` |
| **Next.js (静态导出)** | Next.js (Static HTML Export) | `npm run build` | `out` |
| **Astro** | Astro | `npm run build` | `dist` |
| **Create React App** | Create React App | `npm run build` | `build` |

4. **Environment variables（环境变量，可选）**：
   - 如项目中使用了环境变量（例如 API Base URL、第三方 Key），可在此处展开并添加。
   - 提示：如果项目依赖较新的 Node.js 版本，可添加环境变量：
     - Variable name: `NODE_VERSION`
     - Value: `20` (或 `22`)
5. 点击 **Save and Deploy**（保存并部署）。

---

## 三、部署状态与日常自动化流水线

1. **首次构建监控**：
   - 点击保存后，Cloudflare 会立即拉取代码并启动在线容器运行构建日志。
   - 构建完成（约 30 秒 ~ 2 分钟）后，状态变为 **Success**，并生成专属访问地址：
     `https://<项目名>.pages.dev`
2. **自动化 CI/CD 机制**：
   - **生产环境自动更新**：今后只要向生产分支（如 `main`）执行 `git push`，Cloudflare 会自动侦测并重新构建部署，无需手动干预。
   - **PR 预览分支（Preview Deployments）**：如果团队在 GitHub 提交 Pull Request 或推送到其他分支，Cloudflare 会自动为该分支生成唯一的临时测试链接，便于在合并前验证效果。

---

## 四、绑定自定义域名（Custom Domain）

部署成功后，可将您的专属域名与该项目进行绑定：

### 步骤 1：发起域名绑定
1. 在 Cloudflare 控制台进入刚刚创建的 Pages 项目。
2. 切换到 **Custom domains**（自定义域）选项卡。
3. 点击 **Set up a custom domain**（设置自定义域）。
4. 输入您计划使用的域名：
   - 例如子域名：`ziwei.yourdomain.com`
   - 或根域名：`yourdomain.com`
5. 点击 **Continue**。

### 步骤 2：DNS 解析配置（分两种情况）

#### 情况 A：域名已托管在 Cloudflare（最省心）
- Cloudflare 会自动识别并提示即将自动添加一条 DNS CNAME 记录。
- 点击 **Activate domain**（激活域）即可。
- 系统会在后台自动签发免费 SSL/TLS 证书，无需任何手动操作，通常 1~2 分钟即可通过 HTTPS 访问。

#### 情况 B：域名在第三方注册商（如阿里云、腾讯云、GoDaddy、Namecheap 等）
- Cloudflare 界面会提示您需要到现有 DNS 服务商处添加一条记录，格式如下：
  - **记录类型 (Type)**: `CNAME`
  - **主机记录 (Name/Host)**: `ziwei`（如果是根域名则填 `@`）
  - **记录值 (Value/Target)**: `<您的项目名>.pages.dev`
  - **TTL**: 建议默认或自动 (10 分钟)
- 在原域名服务商添加完成后，回到 Cloudflare 页面点击 **Check DNS**。DNS 生效后状态将显示为 **Active**。

---

## 五、单页应用（SPA）常见问题与优化配置

### 1. 刷新页面 404 错误（History 路由问题）
如果您的项目是 React/Vue 等 SPA 应用，且使用了 Browser Router（如访问 `/destiny/result`），刷新页面可能出现 404。
- **解决方法**：在代码仓库的根目录（或构建输出目录）创建 `_routes.json` 或 `_redirects` 文件。
- `_redirects` 文件内容示例：
  ```text
  /*    /index.html   200
  ```

### 2. 自定义响应头（缓存与安全策略）
在构建输出目录创建 `_headers` 文件，可自定义全站或静态资源的缓存头：
```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable
