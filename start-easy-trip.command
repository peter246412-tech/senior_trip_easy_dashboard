#!/bin/zsh
set -e
cd "${0:A:h}"
if [[ ! -d node_modules ]]; then
  npm ci
fi
if [[ ! -f .env || ! -f prisma/dev.db ]]; then
  npm run setup
fi
npm run build
npm run start
