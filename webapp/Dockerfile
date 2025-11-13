FROM oven/bun:1

RUN apt update && apt install -y curl

WORKDIR /app

COPY . .

RUN cd ..

RUN bun install

RUN npx prisma migrate deploy

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]