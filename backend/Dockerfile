FROM node:26.13.0-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
