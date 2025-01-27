#!/bin/sh

# Espera o banco de dados estar pronto
until pg_isready -h transactions-guard-db -p 5432 -U postgres; do
  echo "Waiting for database to be ready..."
  sleep 2
done

npm run build

# Roda as migrations
npx prisma generate
npx prisma migrate deploy

# Inicia a aplicação
npm run start:prod
