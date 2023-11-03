# chatgpt-nuxt

![preview](/assets/preview-en.png)

ENGLISH | [简体中文](/docs/README-CN.md) | [日本語](/docs/README-JA.md)

This is a frontend application implemented in [Nuxt 3](https://nuxt.com/) for OpenAI's [ChatGPT](https://openai.com/blog/chatgpt) and [DALL·E](https://openai.com/dall-e-2) API.

## Supported APIs

- [OpenAI API](https://openai.com/blog/openai-api)
- [Azure Open AI Service API](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/reference)

## Supported Models

- Chat completion
  - gpt-4
  - gpt-3.5-turbo
- Image generation
  - DALL·E

## Setup

To begin, please ensure you have installed all dependencies:

```bash
npm i
# or
yarn
# or
pnpm i
```

## Development Server

Launch the development server and view it at <http://localhost:3000>:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Production

To build your application for production, execute:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Preview the production build locally with the following command:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Deploy

One-line command for quick deployment:

```bash
docker run -d \
  -p 80:3000 \
  --restart unless-stopped \
  --name chatgpt-nux \
  lianginx/chatgpt-nuxt:latest
```

To deploy using Docker Compose:

```bash
version: "3"
services:
  chatgpt-nux:
    image: lianginx/chatgpt-nuxt:latest
    ports:
      - 80:3000
    restart: unless-stopped
```

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

If you want to set environment variables, please refer to [`.env.example`](/.env.example) and place a `.env` file in the root directory.

## License

This project uses the [MIT](/LICENSE) license.
