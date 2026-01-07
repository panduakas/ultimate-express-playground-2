FROM oven/bun:1.1.10 as base
WORKDIR /app
COPY package.json ./
RUN bun install --no-save
COPY tsconfig.json ./
COPY eslint.config.cjs ./
COPY .prettierrc.cjs ./
COPY ecosystem.config.cjs ./
COPY jest.config.ts ./
COPY src ./src
RUN bun run build
EXPOSE 8080
CMD ["bun", "dist/index.js"]
