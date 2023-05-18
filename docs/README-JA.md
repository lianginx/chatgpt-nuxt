# chatgpt-nuxt

![preview](/assets/preview-ja.png)

[ENGLISH](/README.md) | [简体中文](/docs/README-CN.md) | 日本語

OpenAI の[ChatGPT](https://openai.com/blog/chatgpt)用に[Nuxt 3](https://nuxt.com/)で実装したフロントエンドアプリケーションです。  
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

この README ドキュメントを改善するためのフィードバックや提案がある場合は、遠慮なくお知らせください。あなたのご意見を大切にしています。

## 設定

このアプリケーションは以下の 2 つのいずれかの方法で設定可能です:

- アプリケーション上の設定画面で設定する
- あらかじめ環境変数に設定を定義しておく

環境変数を設定する場合は、`.env.example`を参考にして作成した`.env`ファイルをルートディレクトリに配置して下さい。

| 環境変数            | 期待値の例                                    | 説明                                                                                                 |
| ------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| OPENAI_API_TYPE     | `openai` または `azure`                       | API 種別                                                                                             |
| OPENAI_API_KEY      |                                               | OpenAI または Azure Open AI Service との認証に使用する API キー                                      |
| DEFAULT_TEMPERATURE | `0.0` - `2.0`                                 | 値を大きくすると、出力結果はよりランダムになり、値を小さくするとよりフォーカスされて決定的になります |
| AZURE_API_HOST      | `https://YOUR_RESOURCE_NAME.openai.azure.com` | Azure OpenAI Service のエンドポイント                                                                |
| AZURE_API_VERSION   | `2023-05-15`                                  | Azure OpenAI Service の API バージョン                                                               |
| AZURE_DEPLOYMENT_ID |                                               | Azure OpenAI Service のモデルのデプロイ名                                                            |

## ライセンス

このプロジェクトは [MIT](/LICENSE) ライセンスを使用しています。
