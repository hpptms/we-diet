# ベースイメージとして Node.js の公式イメージを使用
FROM node:18

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json を作業ディレクトリにコピー
COPY package.json ./
COPY package-lock.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコンテナにコピー
COPY . .

# アプリケーションをビルド（環境によっては必要ない場合もあります）
RUN npm run build

# ホストと通信するためのポートを指定
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]
