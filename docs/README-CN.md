# chatgpt-nuxt

![preview](/assets/preview-zh.png)

[ENGLISH](/README.md) | 简体中文 | [日本語](/docs/README-JA.md)

这是一个使用[Nuxt 3](https://nuxt.com/)实现的前端应用程序，用于 OpenAI 的[ChatGPT](https://openai.com/blog/chatgpt)。  
它不仅支持[OpenAI API](https://openai.com/blog/openai-api)，还支持[Azure Open AI Service API](https://learn.microsoft.com/zh-cn/azure/cognitive-services/openai/reference)。

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

## 配置

应用程序可以通过两种方式进行配置：

- 使用应用程序上的配置界面进行设置。
- 通过预先设置环境变量进行设置。

如果要设置环境变量，请先参考 `.env.example` 并在根目录下创建 `.env` 文件。

| 环境变量                        | 预期值的示例                                  | 描述                                                      |
| ------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| NUXT_PUBLIC_USE_ENV             | `yes` 或 `no`                                 | 使用环境变量还是不使用？                                  |
| NUXT_PUBLIC_API_TYPE            | `openai` 或 `azure`                           | API 类型。                                                |
| NUXT_API_KEY                    |                                               | 用于身份验证 OpenAI 或 Azure OpenAI Service 的 API 密钥。 |
| NUXT_PUBLIC_DEFAULT_TEMPERATURE | `0.0` - `2.0`                                 | 值越大，输出结果就越随机；值越小，则越聚焦和确定性。      |
| NUXT_API_HOST                   | `https://YOUR_RESOURCE_NAME.openai.azure.com` | Azure OpenAI Service 的终结点。                           |
| NUXT_AZURE_API_VERSION          | `2023-05-15`                                  | Azure OpenAI Service 的 API 版本。                        |
| NUXT_AZURE_DEPLOYMENT_ID        |                                               | Azure OpenAI Service 上模型的部署名称。                   |

## 许可证

本项目使用 [MIT](/license) 许可证。
