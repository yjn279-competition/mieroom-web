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
```

### Front-End

1. 以下のコマンドでサーバーを起動する。

```shell
pnpm run dev
```

2. [http://localhost:3000](http://localhost:3000)にアクセスする。

### Back-End

1. 新しいターミナルを開く。
2. 以下のコマンドで仮想環境を起動する。

```shell
. .venv/bin/activate
```

3. 以下のコマンドでサーバーを起動する。

```shell
cd src/api
uvicorn main:app --reload
```

4. [http://127.0.0.1:8000](http://127.0.0.1:8000)でAPIサーバーにアクセスできる。


## For Developers

### 技術スタック

- フロントエンド：React × Next.js
- バックエンド：Python × FastAPI
- データベース：Supabase

### ディレクトリ構成

```plaintext
/src
  /api : バックエンドのディレクトリ
  /app : フロントエンドのディレクトリ
...
```

## References

- [Volta](https://docs.volta.sh/guide/getting-started)
- [React](https://ja.react.dev/learn)
- [Next.js](https://nextjs.org/docs)
- [Rye](https://rye.astral.sh/)
- [FastAPI](https://fastapi.tiangolo.com/ja/)
- [Supabase](https://supabase.com/docs/guides/database/overview)
