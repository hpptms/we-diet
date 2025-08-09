# Node.jsベースイメージを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 3000

# 開発サーバーを起動（--hostオプションを追加してホットリロードを有効化）
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
