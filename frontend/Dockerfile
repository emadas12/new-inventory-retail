# Build Stage
FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
# Copy environment variables file
COPY .env .env

RUN npm install

# Copy the rest of the app
COPY . .
RUN npm run build

# Serve Stage
FROM node:18-slim

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
