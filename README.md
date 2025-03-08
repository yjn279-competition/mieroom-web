# mieroom

## Prerequisites

- [Volta](https://docs.volta.sh/guide/getting-started)：JavaScriptのツールマネージャー
  - [pnpmを利用するため、環境変数に `VOLTA_FEATURE_PNPM=1` を設定しておく。](https://docs.volta.sh/advanced/pnpm)
- [Rye](https://rye.astral.sh/)：Pythonのパッケージマネージャー

## Getting Started

### Build a Enviroment

```shell
cd mieroom-web

# Install front-end packages

volta install node
pnpm install

# Install back-end packages

rye sync

# Create local database
npx wrangler d1 execute mieroom --local --file=./schema.sql
```

### Front-End

1. 以下のコマンドでサーバーを起動する。

```shell
pnpm run dev
```

2. [http://localhost:5173](http://localhost:5173)にアクセスする。

### Back-End

1. 新しいターミナルを開く。
2. 以下のコマンドで仮想環境を起動する。

```shell
. .venv/bin/activate
```

### Database

3. 以下のコマンドでデータを確認する。

```shell
npx wrangler d1 execute mieroom --local --command="SELECT * FROM Cities"
```

4. [http://127.0.0.1:8000](http://127.0.0.1:8000)でAPIサーバーにアクセスできる。


## For Developers

### 技術スタック

- フロントエンド：React × Remix
- バックエンド：Python × FastAPI
- データベース：Supabase

### ディレクトリ構成

```plaintext
/api : バックエンドのディレクトリ
/app : フロントエンドのディレクトリ
...
```

### フロントエンド

- shadcn/uiでコンポーネントを追加する。

```shell
pnpm dlx shadcn@latest add {component}
```

## References

- [React](https://ja.react.dev/learn)
- [Remix](https://remix.run/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Volta](https://docs.volta.sh/guide/getting-started)
- [pnpm](https://pnpm.io/ja/)
- [Rye](https://rye.astral.sh/)
- [FastAPI](https://fastapi.tiangolo.com/ja/)
- [Supabase](https://supabase.com/docs/guides/database/overview)
