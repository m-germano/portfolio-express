FROM node:22-alpine as base

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Garante que o Prisma gere os arquivos corretamente
RUN npx prisma generate

# Define variavel para producao
ENV NODE_ENV=production

# Expõe a porta da aplicação
EXPOSE 3000

CMD ["node", "app.js"]
