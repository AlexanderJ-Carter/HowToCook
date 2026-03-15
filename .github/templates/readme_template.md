# 程序员做饭指南（Fork）

[![build](https://github.com/Anduin2017/HowToCook/actions/workflows/build.yml/badge.svg)](https://github.com/Anduin2017/HowToCook/actions/workflows/build.yml)
[![License](https://img.shields.io/github/license/Anduin2017/HowToCook)](./LICENSE)
[![Docker](https://img.shields.io/badge/docker-latest-blue?logo=docker)](https://github.com/Anduin2017/HowToCook/pkgs/container/how-to-cook)

> 本仓库为 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook) 的**二次修改 fork**，在保留原菜谱与文档基础上做了构建与文档优化。详见 [FORK_INFO.md](./FORK_INFO.md)。

用更清晰、结构化的方式整理常见菜的做法，方便习惯「形式化」描述的程序员使用，由社区共同维护。

---

## 本 Fork 的修改

| 类型           | 说明                                             |
| -------------- | ------------------------------------------------ |
| **starsystem** | 修复异常难度评级，仅输出 1–5 星有效索引          |
| **构建脚本**   | readme-generate.js 优化（统一 fs、移除调试输出） |
| **文档**       | CONTRIBUTING、FORK_INFO、SECURITY 等完善         |
| **Docker**     | 镜像标签与说明指向本 fork                        |

---

## Docker 部署

**本 fork 镜像：**

```bash
docker pull ghcr.io/alexanderj-carter/how-to-cook:latest
docker run -d -p 5000:80 ghcr.io/alexanderj-carter/how-to-cook:latest
```

**上游镜像：** `ghcr.io/anduin2017/how-to-cook:latest`

访问 http://localhost:5000 。PDF 见 [cook.aiursoft.com/document.pdf](https://cook.aiursoft.com/document.pdf)。

---

## 如何贡献

直接修改并提交 Pull Request 即可。新菜谱请基于 [示例菜](https://github.com/Anduin2017/HowToCook/blob/master/dishes/template/%E7%A4%BA%E4%BE%8B%E8%8F%9C/%E7%A4%BA%E4%BE%8B%E8%8F%9C.md?plain=1) 编写，规范见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## 搭建环境

{{before}}

## 菜谱

{{index_stars}}

{{main}}

## 进阶知识学习

如果你已经做了许多上面的菜，对于厨艺已经入门，并且想学习更加高深的烹饪技巧，请继续阅读下面的内容：

{{after}}

## 衍生作品推荐

- [图像化菜谱：支持在线预览与 PDF 导出](https://king-jingxiang.github.io/HowToCook/)
- [HowToCook-mcp](https://github.com/worryzyy/HowToCook-mcp) / [HowToCook-py-mcp](https://github.com/DusKing1/howtocook-py-mcp) — AI 助手菜谱
- [whatToEat](https://github.com/ryanuo/whatToEat) — 今天吃什么决策工具

---

## 致谢

感谢 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook) 及社区。若觉得有帮助，欢迎给 [原仓库](https://github.com/Anduin2017/HowToCook) 加 Star ⭐ 。
