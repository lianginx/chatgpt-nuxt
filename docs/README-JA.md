# chatgpt-nuxt

![preview](/assets/preview-ja.png)

[ENGLISH](/README.md) | [简体中文](/docs/README-CN.md) | 日本語

OpenAIの[ChatGPT](https://openai.com/blog/chatgpt)用に[Nuxt 3](https://nuxt.com/)で実装したフロントエンドアプリケーションです。  
[OpenAI API](https://openai.com/blog/openai-api)はもちろん、[Azure Open AI Service API](https://learn.microsoft.com/ja-jp/azure/cognitive-services/openai/reference)もサポートしています。

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

Docker Compose を用いてデプロイが可能です。

```bash
docker-compose up -d # バックグラウンドで起動
docker-compose stop  # 停止
docker-compose down  # 停止＆削除
```

デプロイが完了すると `80`番ポートで接続できるようになります。

このREADMEドキュメントを改善するためのフィードバックや提案がある場合は、遠慮なくお知らせください。あなたのご意見を大切にしています。

## ライセンス

このプロジェクトは [MIT](/LICENSE) ライセンスを使用しています。
