FROM node:22-alpine3.21

RUN apk add --no-cache postgresql-client

WORKDIR /app/api

COPY package.json package-lock.json /app/api/

RUN npm ci --silent

COPY . /app/api/

# Copia o script de inicialização
COPY start.sh /app/api/start.sh
RUN chmod +x /app/api/start.sh

CMD ["./start.sh"]
