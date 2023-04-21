# chatgpt-nuxt

![preview](/assets/preview-v2.png)

[ENGLISH](/README.md) | 简体中文

## 设置

首先，请确保您已安装所有依赖项：

```bash
npm i
# 或
yarn
```

## 开发服务器

启动开发服务器并在 http://localhost:3000 上查看它：

```bash
npm run dev
# 或
yarn dev
```

## 生产

要为生产构建应用程序，请执行：

```bash
npm run build
# 或
yarn build
```

使用以下命令在本地预览生产构建：

```bash
npm run preview
# 或
yarn preview
```

## 部署

要使用 Docker Compose 部署：

```bash
docker-compose up -d # 启动并在后台运行。
docker-compose stop  # 停止
docker-compose down  # 停止并删除
```

完成后，您的项目将部署到端口 `80`。

如果您对此 README 文档有任何反馈或建议，立即告诉我，我将很感激您的意见。

## 许可证

本项目使用 [MIT](/license) 许可证。
