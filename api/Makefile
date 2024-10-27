# 仮想環境のディレクトリ
VENV_DIR = .venv

# Pythonのバージョン指定
PYTHON = python3

# 仮想環境のPython実行ファイル
VENV_PYTHON = $(VENV_DIR)/bin/python

# 仮想環境を作成し、依存パッケージをインストール
install:
	$(PYTHON) -m venv $(VENV_DIR)
	$(VENV_PYTHON) -m pip install --upgrade pip
	$(VENV_PYTHON) -m pip install -r requirements.txt

# マイグレーションを実行
migrate:
	PYTHONPATH=$(PWD) $(VENV_PYTHON) migrate.py

# アプリケーションを実行
run:
	PYTHONPATH=$(PWD) $(VENV_PYTHON) run_app.py

# 仮想環境を作成し、依存パッケージをインストールしてアプリケーションを実行
start: install run

# 仮想環境を削除
clean:
	rm -rf $(VENV_DIR)
