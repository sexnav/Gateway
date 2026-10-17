# SEX123 Gateway

**NTRSP 专属永久入口**，与四平台镜像地址发布页分离部署。

## 最终架构

```text
sex123.top
  └─ 点击「立即进入」
       └─ Gateway 并发检测四个平台镜像
          ├─ sex123.vercel.app
          ├─ sex123.pages.dev
          ├─ sexnav.github.io
          └─ sex123.netlify.app
               └─ NTRSP 永久地址发布页（自动检测主备业务线路）
                    ├─ ntrsp.com   主域名
                    └─ 439000.xyz 备用域名
```

- **本仓库 [sexnav/Gateway](https://github.com/sexnav/Gateway)**：`sex123.top` 品牌首页和四平台镜像选择。
- **[sexnav/sexnav.github.io](https://github.com/sexnav/sexnav.github.io)**：四平台统一部署的 NTRSP 主备域名测速页。
- 纯前端 HTML/CSS/JavaScript；不需要数据库或后台。

## 开源复用

以 [aidizhi/aidizhi.github.io](https://github.com/aidizhi/aidizhi.github.io)（MIT）为基线，复用原版入口页的业务结构与 GO 图片测速机制；**生产视觉层统一替换为 Tabler UI 1.6.1 官方组件和样式**，不再使用原版内嵌 CSS。上游核心文件保留于 `vendor/aidizhi/`，根目录 `LICENSE` 保留原版权声明。

生产只发布 `public/`，不公开上游的旧品牌、APK、邮件地址或业务域名。

### UI 复用标准

- 首页和 GO 页面直接使用 Tabler 原生 Card、Button、Badge、Alert、List Group、Spinner 与深色模式。
- Tabler 1.6.1 编译 CSS 被固定在 `public/assets/vendor/tabler.min.css`，不从运行时 CDN 下载。
- MIT 原始许可见 `public/assets/vendor/TABLER-LICENSE.txt`；上游原版源码仍保留于 `vendor/aidizhi/` 作为历史与逻辑参考。
- 不再为 Gateway 单独维护手写样式表或内联 `<style>`。


## 行为

- 访问 `sex123.top`：先展示品牌首页，**不自动跳转**。
- 点击「立即进入」：进入 `/go.html`，并发探测四个 Navigation 镜像的 `/assets/favicon.svg`。
- 选择本次探测成功且图片响应较快的镜像；全部失败则显示手动选择。
- 镜像打开后，显示 NTRSP 主备业务域名的自动测速页，由用户点击推荐线路进入 WordPress。
- 浏览器资源探测不是网络 Ping，也不能证明整个 WordPress 站点业务健康。

## 预览与发布

```bash
git clone https://github.com/sexnav/Gateway.git
cd Gateway
python3 -m http.server 8080 --directory public
node --test tests/gateway.test.mjs
```

本次 UI 组件替换先在 `feat/tabler-gateway-ui` 预览验证，合并后发布到 `main`。旧版正式分支已部署在 [sex123-gateway-iota.vercel.app](https://sex123-gateway-iota.vercel.app/) 并通过 GitHub Actions 验证。Vercel Framework 选 Other/None，发布目录 `public`。**`sex123.top` 目前仍绑定旧 Vercel `ntrsp` 项目，未完成新项目的域名所有权验证与切换。** 旧项目保留用于回退。
