# ---- پایه: Node 20 روی Alpine (سبک و مناسب Next) ----
    FROM node:20-alpine

    # داخل کانتینر اینجا کار می‌کنیم
    WORKDIR /app
    
    # اول فقط پکیج‌ها رو کپی می‌کنیم تا layer cache بشه
    COPY package*.json ./
    
    # نصب همه پکیج‌ها (هم dev هم prod، چون تو کانتینر به prisma/ts-node هم نیاز داریم)
    RUN npm install
    
    # حالا بقیه‌ی سورس پروژه
    COPY . .
    
    # محیط اجرای پروداکشن
    ENV NODE_ENV=production
    
    # Prisma Client بساز
    RUN npx prisma generate
    
    # Next.js رو build کن
    RUN npm run build
    
    # پورت داخلی اپ
    EXPOSE 3000
    
    # موقع استارت کانتینر:
    # 1) migrate های Prisma رو روی dev.db اعمال کن
    # 2) بعد npm start (که خودش prisma db seed رو صدا می‌زنه طبق اسکریپت تو package.json)
    CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
    