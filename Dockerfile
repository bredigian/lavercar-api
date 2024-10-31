FROM node:22

WORKDIR /app

COPY package*.json /app

RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 3001

RUN pnpx prisma generate && pnpm run build

CMD ["pnpm", "run", "start:sync&prod"]