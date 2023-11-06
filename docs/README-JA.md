# chatgpt-nuxt

![preview](/assets/preview-ja.png)

[ENGLISH](/README.md) | [简体中文](/docs/README-CN.md) | 日本語

OpenAI 社の [ChatGPT](https://openai.com/blog/chatgpt) および [DALL·E](https://openai.com/dall-e-2) の API を使用するために [Nuxt 3](https://nuxt.com/) で実装したフロントエンドアプリケーションです。

## 対応 API

- [OpenAI API](https://openai.com/blog/openai-api)
- [Azure Open AI Service API](https://learn.microsoft.com/ja-jp/azure/cognitive-services/openai/reference)

## 対応モデル

- Chat completion
  - gpt-4
  - gpt-3.5-turbo
- Image generation
  - DALL·E

## セットアップ

最初に全ての依存関係をインストールします。

```bash
npm i
# or
yarn
```

## 開発サーバーの起動

以下のコマンドで開発用のサーバーをローカルで起動すると <http://localhost:3000> で動作確認が可能です。

```bash
npm run dev
# or
yarn dev
```

## プロダクション・ビルド

プロダクション用にビルドする場合は次のコマンドを実行します。

```bash
npm run build
# or
yarn build
```

プロダクション・ビルドをローカルでプレビューするには、以下のコマンドを実行します。

```bash
npm run preview
# or
yarn preview
```

## デプロイ

クイックデプロイメントのためのワンライナーコマンド：

```bash
docker run -d \
  -p 80:3000 \
  --restart unless-stopped \
  --name chatgpt-nuxt \
  lianginx/chatgpt-nuxt:latest
```

Docker Compose を用いてデプロイが可能です。

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
docker-compose up -d # バックグラウンドで起動
docker-compose stop  # 停止
docker-compose down  # 停止＆削除
```

デプロイが完了すると `80` 番ポートで接続できるようになります。

この README ドキュメントを改善するためのフィードバックや提案がある場合は、遠慮なくお知らせください。あなたのご意見を大切にしています。

## 設定

このアプリケーションは以下の 2 つのいずれかの方法で設定可能です:

- アプリケーション上の設定画面で設定する
- あらかじめ環境変数に設定を定義しておく

環境変数を設定する場合は、[`.env.example`](/.env.example) を参考にして作成した `.env` ファイルをルートディレクトリに配置して下さい。

## ライセンス

このプロジェクトは [MIT](/LICENSE) ライセンスを使用しています。
