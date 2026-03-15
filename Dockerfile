# ============================
# Prepare lint Environment
FROM node:22-alpine AS lint-env
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build
RUN npm run lint

# ============================
# Prepare Build Environment
FROM python:3.12-slim AS python-env
WORKDIR /app
# 安装依赖并清理缓存
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        weasyprint \
        fonts-noto-cjk \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=lint-env /app .
RUN mkdocs build

# ============================
# Prepare Runtime Environment
FROM nginx:1-alpine
# 添加标签
LABEL org.opencontainers.image.source="https://github.com/Anduin2017/HowToCook"
LABEL org.opencontainers.image.description="程序员在家做饭方法指南"
LABEL org.opencontainers.image.licenses="Unlicense"

# 复制构建产物
COPY --from=python-env /app/site /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# nginx alpine 默认以非 root 用户运行 (nginx:nginx)
EXPOSE 80
