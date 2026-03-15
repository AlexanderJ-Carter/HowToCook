# Fork 说明

本仓库是 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook) 的个人 fork。

## 主要改动

- 修复了 starsystem 目录中的异常评级问题
- 优化了 `readme-generate.js` 中的星级计算逻辑
- 更新了项目配置文件（package.json, Dockerfile, GitHub Actions）
- 完善了 CONTRIBUTING.md 和 lint 配置

## 如何同步上游

```bash
# 添加上游仓库
git remote add upstream https://github.com/Anduin2017/HowToCook.git

# 拉取上游更新
git fetch upstream

# 合并到本地
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
