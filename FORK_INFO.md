# Fork 说明

本仓库是 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook) 的个人 fork。

## 相对上游的改动

- **starsystem**：修复异常难度评级，仅输出 1–5 星有效索引
- **readme-generate.js**：统一 fs 使用、移除调试输出、逻辑优化
- **工程**：package.json、Dockerfile、GitHub Actions、CONTRIBUTING.md 与 lint 配置完善

## 同步上游

> 上游默认分支为 `master`，若你使用 `main` 请相应调整分支名。

```bash
git remote add upstream https://github.com/Anduin2017/HowToCook.git
git fetch upstream
git merge upstream/master
```

## Docker 镜像

本 fork 的 Docker 镜像发布在：

```bash
docker pull ghcr.io/alexanderj-carter/how-to-cook:latest
```

## 致谢

感谢 [Anduin2017](https://github.com/Anduin2017) 创建了这个优秀的项目！

如果你喜欢这个项目，请给 [原仓库](https://github.com/Anduin2017/HowToCook) 一个 Star ⭐
