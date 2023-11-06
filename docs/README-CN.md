# chatgpt-nuxt

![preview](/assets/preview-zh.png)

[ENGLISH](/README.md) | 简体中文 | [日本語](/docs/README-JA.md)

这是一个使用[Nuxt 3](https://nuxt.com/)实现的前端应用程序，用于 OpenAI 的 [ChatGPT](https://openai.com/blog/chatgpt) 和 [DALL·E](https://openai.com/dall-e-2) API。

## 支持的 API

- [OpenAI API](https://openai.com/blog/openai-api)
- [Azure Open AI Service API](https://learn.microsoft.com/zh-cn/azure/cognitive-services/openai/reference)

## 支持的模型

- Chat completion
  - gpt-4
  - gpt-3.5-turbo
- Image generation
  - DALL·E

## 设置

首先，请确保您已安装所有依赖项：

```bash
npm i
# 或
yarn
```

## 开发服务器

启动开发服务器并在 <http://localhost:3000> 上查看它：

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

一行命令快速部署：

```bash
docker run -d \
  -p 80:3000 \
  --restart unless-stopped \
  --name chatgpt-nuxt \
  lianginx/chatgpt-nuxt:latest
```

使用 Docker Compose 文件部署：

```bash
version: "3"
services:
  chatgpt-nuxt:
    image: lianginx/chatgpt-nuxt:latest
    ports:
      - 80:3000
    restart: unless-stopped
```

```bash
docker-compose up -d # 启动并在后台运行。
docker-compose stop  # 停止
docker-compose down  # 停止并删除
```

完成后，您的项目将部署到端口 `80`。

如果您对此 README 文档有任何反馈或建议，立即告诉我，我将很感激您的意见。

## 配置

应用程序可以通过两种方式进行配置：

- 使用应用程序上的配置界面进行设置。
- 通过预先设置环境变量进行设置。

如果要设置环境变量，请先参考 [`.env.example`](/.env.example) 并在根目录下创建 `.env` 文件。

## 许可证

本项目使用 [MIT](/license) 许可证。
