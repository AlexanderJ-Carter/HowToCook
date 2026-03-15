# Fork 说明

本仓库是 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook) 的二次修改 fork，保留原菜谱与文档并做工程与文档优化。

## 相对上游的改动

- **starsystem**：修复异常难度评级，仅输出 1–5 星有效索引
- **readme-generate.js**：统一 fs 使用、移除调试输出、逻辑优化
- **文档**：CONTRIBUTING、FORK_INFO、SECURITY、README 模板等
- **Docker**：镜像与 LABEL 指向本 fork

## 同步上游

上游默认分支为 `master`。

```bash
git remote add upstream https://github.com/Anduin2017/HowToCook.git
git fetch upstream
git merge upstream/master
```

## Docker 镜像

本 fork：`docker pull ghcr.io/alexanderj-carter/how-to-cook:latest`

## 致谢

感谢 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook)。喜欢请给 [原仓库](https://github.com/Anduin2017/HowToCook) Star ⭐
