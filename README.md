# chatgpt-nuxt

![preview](/assets/preview-v2.png)

ENGLISH | [简体中文](/docs/README-CN.md)

## Setup

To begin, please ensure you have installed all dependencies:

```bash
npm i
#or
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

## License

This project uses the [MIT](/LICENSE) license.
