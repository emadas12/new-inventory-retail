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
