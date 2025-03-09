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
pnpm wrangler d1 migrations apply mieroom --local
pnpx prisma generate
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

3. 以下のコマンドでローカルのDBを確認する。

```shell
pnpm wrangler d1 execute mieroom --local --command="PRAGMA table_list"
pnpm wrangler d1 execute mieroom --local --command="PRAGMA table_info("cities")"
pnpm wrangler d1 execute mieroom --local --command="SELECT * FROM cities"
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

### Front-End

- shadcn/uiでコンポーネントを追加する。

```shell
pnpm dlx shadcn@latest add {{ component }}
```

### Database

- 以下のコマンドでマイグレーションを実施する。

```shell
pnpm wrangler d1 migrations create mieroom {{ migration_name }}
pnpx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output ./prisma/migrations/{{ migration_filename }}.sql
pnpm wrangler d1 migrations apply mieroom --local
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
