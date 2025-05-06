FROM node:22.15.0-alpine3.20
WORKDIR /app
COPY ./back-end/package.json ./back-end/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY ./back-end .
EXPOSE 8080
CMD ["pnpm", "run", "dev"]