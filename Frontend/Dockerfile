# === STAGE 1: Build - Compila a Aplicação Vite ===
FROM node:20-alpine as build

# Define o diretório de trabalho
WORKDIR /app

# Copia e instala dependências
COPY package*.json ./
RUN npm install

# Copia o código fonte e executa o build de produção
COPY . .
# O comando padrão do Vite para compilação
RUN npm run build 

# === STAGE 2: Production - Servir com Nginx ===
# Usa a imagem oficial do Nginx
FROM nginx:alpine

# Define a porta que o Nginx irá escutar (deve corresponder ao 5173 do docker-compose)
EXPOSE 80

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adiciona um arquivo de configuração simples do Nginx para aplicações Single Page Application (SPA)
# Isso é crucial para que as rotas internas funcionem (ex: /sobre)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados pelo Vite (da pasta 'dist') para o diretório de servir do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]