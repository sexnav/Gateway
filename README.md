# SEX123.TOP Gateway

本仓库发布 https://sex123.top/ 第一层入口页。

入口页并发测速以下四个镜像，并在测速完成后让“立即进入”指向当前响应最快的镜像：

- https://sexnav.github.io/
- https://sex123.vercel.app/
- https://sex123.pages.dev/
- https://sex123.netlify.app/

镜像内展示 NTRSP 主备地址发布页。生产目录为 `public/`，Vercel 项目为 `sex123-gateway`。

## 行为

1. 访问 `SEX123.TOP` 后立即开始两轮并发测速。
2. 推荐卡片只选择本次检测成功且延迟最低的镜像。
3. 自动检测均失败时保留四个手动入口与重新检测按钮。
4. 浏览器资源测速用于镜像选择，不等同于传统 Ping。
