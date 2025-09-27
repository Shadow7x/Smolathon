# runtime-образ
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# копируем package.json, чтобы npm start работал
COPY package*.json ./

# копируем готовый билд
COPY .next ./.next
COPY public ./public

# копируем node_modules (собери их локально с прод зависимостями!)
COPY node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]