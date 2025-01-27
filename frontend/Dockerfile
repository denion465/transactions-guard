FROM node:22-alpine3.21

WORKDIR /app/frontend

COPY package.json package-lock.json /app/frontend/

RUN npm ci --silent

COPY . /app/frontend/

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
