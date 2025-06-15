<<<<<<< HEAD
# שלב build עם משתני סביבה
FROM node:18-alpine AS builder

WORKDIR /app

# מעתיקים את הקבצים לפני ההתקנה
COPY package.json package-lock.json ./
RUN npm install

# מעתיקים את שאר הקוד
COPY . .

# מריצים build עם משתני סביבה אם יש
RUN npm run build

# שלב הפצה
FROM node:18-alpine

WORKDIR /app

# מתקינים את serve רק בשביל הריצה
RUN npm install -g serve

# מעתיקים את התוצר המוכן מה-build
COPY --from=builder /app/dist .

# פורט 80 לצפייה
EXPOSE 80

# הרצה של האפליקציה
CMD ["serve", "-s", ".", "-l", "80"]
=======
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
>>>>>>> a06fb989811003506e81d3f5a412a9ead115a63d
