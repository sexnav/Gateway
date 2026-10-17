# Gateway 复用策略

## 上游基线

- 来源：[aidizhi/aidizhi.github.io](https://github.com/aidizhi/aidizhi.github.io)
- 许可证：MIT，原始声明保留在仓库根目录及 `vendor/aidizhi/LICENSE`
- `vendor/aidizhi/` 保存原始核心文件快照，作为适配参考，不直接作为生产发布目录。

## 保留与复用

- 原有品牌入口的静态布局、样式与响应式设计。
- 原有 GO 的内置浏览器提示、图片资源并发探测、线路历史评分思路。
- 原有 PWA / Service Worker 及离线页（审查后按实际需要保留）。

## 必须改造

- Gateway 唯一动作：点击「立即进入」后选择 **Navigation 镜像**，而不是跳转 NTRSP 业务站。
- 四条镜像：`sex123.vercel.app`、`sex123.pages.dev`、`sexnav.github.io`、`sex123.netlify.app`。
- 从上游移除邮件找回、APK、旧品牌/业务地址、旧搜索引擎结构化数据。
- 镜像地址改为配置文件，避免 XOR 数组中写死；探测必须使用实际存在的静态资源。
- 不沿用上游对爬虫伪造 404 的逻辑；对正常搜索引擎保留可访问的品牌主页。
- 自动检测全部失败时保留手动入口，不能无条件跳转未经确认的地址。
- 不复制 Navigation 的项目卡片与业务 GO；两个系统分别部署。
- PWA 不缓存动态线路配置，避免过期镜像地址。
- 先在独立预览验收，最后迁移 `sex123.top`，保留现有 Vercel 部署作为回退。

## 发布策略

- `main`：项目文档和未来正式版；当前不可直接用作正式 Gateway。
- `vendor/aidizhi-base`：保留开源基线；**不直接部署**，避免上游业务链接误上线。
- 后续从该基线派生适配分支，经过测试与预览再合并。
