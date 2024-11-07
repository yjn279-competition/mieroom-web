# OPEN DATA HACKATHON 2024

## Prerequisites

- [Volta](https://docs.volta.sh/guide/getting-started)：JavaScriptのツールマネージャー
- [Rye](https://rye.astral.sh/)：Pythonのパッケージマネージャー

## Getting Started

### Build a Enviroment

```shell
cd open-data-hackathon-2024

# Install front-end packages

volta install node
npm install

# Install back-end packages

rye sync
```

### Front-End

1. 以下のコマンドでサーバーを起動する。

```shell
npm run dev
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
