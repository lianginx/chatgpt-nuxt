# chatgpt-nuxt

![preview](/assets/preview-en.png)

ENGLISH | [简体中文](/docs/README-CN.md) | [日本語](/docs/README-JA.md)

This is a frontend application implemented in [Nuxt 3](https://nuxt.com/) for OpenAI's [ChatGPT](https://openai.com/blog/chatgpt).  
It supports not only the [OpenAI API](https://openai.com/blog/openai-api) but also the [Azure Open AI Service API](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/reference).

## Setup

To begin, please ensure you have installed all dependencies:

```bash
npm i
# or
yarn
```

## Development Server

Launch the development server and view it at http://localhost:3000:

```bash
npm run dev
# or
yarn dev
```

## Production

To build your application for production, execute:

```bash
npm run build
# or
yarn build
```

Preview the production build locally with the following command:

```bash
npm run preview
# or
yarn preview
```

## Deploy

To deploy using Docker Compose:

```bash
docker-compose up -d # Start and run in the background.
docker-compose stop  # Stop
docker-compose down  # Stop and delete
```

When completed, your project will be deployed onto port `80`.

If you have any feedback or suggestions for improving this README document, please don’t hesitate to let me know. I appreciate your input.

## Configuration

There are two ways to configure the application:

- setting it up using the configuration screen on the application.
- setting it up by using environment variables in advance.

If you want to set environment variables, please refer to `.env.example` and place a `.env` file in the root directory.

| Environment Variable            | Examples of expected value                    | Description                                                                                                     |
| ------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| NUXT_PUBLIC_USE_ENV             | `yes` or `no`                                 | Use environment variables or not.                                                                               |
| NUXT_PUBLIC_API_TYPE            | `openai` or `azure`                           | The API type.                                                                                                   |
| NUXT_API_KEY                    |                                               | The API key used for authentication with OpenAI or Azure OpenAI Service.                                        |
| NUXT_PUBLIC_DEFAULT_TEMPERATURE | `0.0` - `2.0`                                 | Higher values will make the output more random, while lower values will make it more focused and deterministic. |
| NUXT_API_HOST                   | `https://YOUR_RESOURCE_NAME.openai.azure.com` | The endpoint of the Azure OpenAI Service.                                                                       |
| NUXT_AZURE_API_VERSION          | `2023-05-15`                                  | API version of the Azure OpenAI Service.                                                                        |
| NUXT_AZURE_DEPLOYMENT_ID        |                                               | Deployment name of the model on the Azure OpenAI Service.                                                       |

## License

This project uses the [MIT](/LICENSE) license.
