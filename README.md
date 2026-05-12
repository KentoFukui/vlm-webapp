# VLM 画像解析アプリ

画像をアップロードすると、GPT-4o Vision APIが日本語で内容を説明するWebアプリです。Next.js + TypeScript + Tailwind CSSで構築しています。

## 使い方

### 1. リポジトリをクローン

```bash
git clone https://github.com/KentoFukui/vlm-webapp.git
cd vlm-webapp
```

### 2. 依存パッケージをインストール

Node.js v20以上が必要です。

```bash
npm install
```

### 3. APIキーを設定

`.env.local.example` をコピーして `.env.local` を作成し、OpenAI APIキーを入力します。

```bash
cp .env.local.example .env.local
```

`.env.local` を開いて編集：

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 5. 画像を解析する

1. 画面中央のエリアをクリックして画像を選択
2. 「画像を解析する」ボタンを押す
3. しばらく待つと、AIが画像の内容を日本語で説明します

## 使用技術

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- [OpenAI GPT-4o Vision API](https://platform.openai.com/docs/guides/vision)

## 注意事項

- `.env.local` はGitにコミットしないでください（APIキーが漏洩します）
- OpenAI APIの利用には料金が発生します。[料金ページ](https://openai.com/pricing)を確認してください
