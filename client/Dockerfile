FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Cài đặt dependencies với --force
RUN npm install --legacy-peer-deps --force
RUN npm install -g serve

COPY . .

# Set môi trường
ENV NODE_ENV=production
ENV CI=false
ENV DISABLE_ESLINT_PLUGIN=true

# Build
RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]