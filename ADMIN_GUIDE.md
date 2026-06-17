# 🛠️ راهنمای پنل ادمین

پنل ادمین به پروژه اضافه شد با Prisma + SQLite + JWT.

## 🚀 راه‌اندازی اولیه

### مرحله ۱: نصب وابستگی‌ها

```powershell
cd C:\Users\zm\Desktop\ppp
npm install
```

این کار:
- پکیج‌های جدید نصب می‌کنه (Prisma، bcryptjs، jose، tsx)
- Prisma Client رو خودکار generate می‌کنه (postinstall)

### مرحله ۲: ساخت فایل `.env`

```powershell
copy .env.example .env
```

سپس فایل `.env` رو باز کن و این مقادیر رو ست کن:

```env
DATABASE_URL="file:./data/portfolio.db"
JWT_SECRET="یه رشته‌ی تصادفی حداقل ۳۲ کاراکتر — مثلاً با node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" بساز"
ADMIN_USERNAME="alireza"
ADMIN_PASSWORD="یه پسورد قوی"
```

### مرحله ۳: ایجاد دیتابیس و انتقال داده‌ها

```powershell
# ساخت دیتابیس از روی schema
npm run db:push

# پر کردن دیتابیس با داده‌های portfolio.ts
npm run db:seed
```

این `seed`:
- یک کاربر ادمین با مقادیر `.env` می‌سازه
- تمام پروژه‌ها، مهارت‌ها، سوابق و بلاگ‌پست‌های فعلی رو وارد دیتابیس می‌کنه

### مرحله ۴: اجرای پروژه

```powershell
npm run dev
```

سپس برو به: [http://localhost:3000/admin](http://localhost:3000/admin)

با نام کاربری و پسوردی که در `.env` گذاشتی وارد شو.

---

## 📋 امکانات پنل

### ✅ داشبورد `/admin`
آمار کلی + دسترسی سریع به همه‌ی بخش‌ها

### ✅ پروژه‌ها `/admin/projects`
- لیست همه‌ی پروژه‌ها با نمایش وضعیت Featured/Published
- ساخت پروژه‌ی جدید با فرم کامل (دو زبانه، گالری، چالش‌ها، ویژگی‌ها، نقش، مدت زمان...)
- ویرایش و حذف
- مرتب‌سازی با فیلد `order`

### ✅ مهارت‌ها `/admin/skills`
- اضافه/حذف/ویرایش inline
- گروه‌بندی بر اساس دسته (backend / frontend / mobile / database / devops / tools)
- تنظیم سطح ۰-۱۰۰

### ✅ سوابق کاری `/admin/experiences`
- مدیریت تجربیات کاری و تحصیلی
- accordion expandable برای ویرایش

### ✅ بلاگ `/admin/blog`
- ساخت/ویرایش/حذف مقاله
- پشتیبانی از Markdown
- پیش‌نویس / منتشر شده

### ✅ تنظیمات `/admin/settings`
- اطلاعات شخصی (نام، تیتر، تماس، بیو)
- شبکه‌های اجتماعی
- آمار About (سال تجربه، تعداد پروژه...)

### ✅ پیام‌ها `/admin/messages`
- نمایش همه‌ی پیام‌های فرم تماس که از سایت ارسال شدن

---

## 🔧 دستورات مفید

```bash
npm run db:push       # اعمال تغییرات schema روی DB
npm run db:seed       # پر کردن DB با portfolio.ts
npm run db:studio     # GUI گرافیکی برای دیدن/ویرایش جداول
npm run db:reset      # حذف همه‌ی داده‌ها (با احتیاط!)
npm run admin:create  # ساخت کاربر جدید
npm run admin:create -- newuser newpassword
```

### Prisma Studio

برای دیدن مستقیم محتویات دیتابیس از طریق GUI:

```powershell
npm run db:studio
```

در [http://localhost:5555](http://localhost:5555) باز می‌شه.

---

## 🐘 استفاده از PostgreSQL به جای SQLite

اگه می‌خوای از Postgres استفاده کنی (برای production):

### ۱. در `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // 👈 تغییر بده
  url      = env("DATABASE_URL")
}
```

### ۲. در `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
```

### ۳. در `docker-compose.yml` یک سرویس Postgres اضافه کن:

```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: portfolio
    POSTGRES_PASSWORD: secret
    POSTGRES_DB: portfolio
  volumes:
    - pgdata:/var/lib/postgresql/data
  networks:
    - portfolio_net

volumes:
  pgdata:
```

### ۴. اعمال migration:

```bash
npm run db:push
npm run db:seed
```

---

## 🔒 امنیت در Production

### چک‌لیست حتمی قبل از deploy:

- [ ] `JWT_SECRET` رو با یه رشته‌ی تصادفی قوی عوض کن (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] `ADMIN_PASSWORD` رو حتماً تغییر بده
- [ ] HTTPS رو فعال کن (در `next.config.js` سپس Nginx + Let's Encrypt)
- [ ] فایل `.env` رو commit نکن (در `.gitignore` هست)
- [ ] برای backup گرفتن از SQLite، فایل `data/portfolio.db` رو کپی کن

### Backup خودکار

```bash
# هر روز ساعت ۲ شب
0 2 * * * cp /path/to/data/portfolio.db /backups/portfolio-$(date +\%Y\%m\%d).db
```

---

## 🐳 با Docker

داکر فعلی شما SQLite رو به‌خوبی پشتیبانی می‌کنه. فقط مطمئن شو که در `docker-compose.yml`:

```yaml
services:
  web:
    # ...
    volumes:
      - ./data:/app/data   # 👈 برای persist کردن دیتابیس
    environment:
      - DATABASE_URL=file:./data/portfolio.db
      - JWT_SECRET=${JWT_SECRET}
```

سپس قبل از بالا آوردن:

```bash
docker compose run --rm web npm run db:push
docker compose run --rm web npm run db:seed
docker compose up -d
```

---

## 🆘 مشکلات رایج

### "PrismaClient is unable to be run in the browser"
این یعنی جایی DB رو از client component فراخوانی کردی. باید از `'use client'` حذف یا fetch از API استفاده کنی.

### "Can't reach database server"
1. مطمئن شو فایل `.env` ساخته شده
2. مطمئن شو پوشه‌ی `data/` وجود داره
3. اجرا کن: `npm run db:push`

### پسوردم رو فراموش کردم
```powershell
npm run admin:create -- alireza newpassword
```

---

## 📁 فایل‌های مهم

```
prisma/
  schema.prisma     # تعریف جداول
  seed.ts           # انتقال portfolio.ts به DB
  createAdmin.ts    # ساخت کاربر ادمین
  data/             # SQLite database file (با .gitignore)

src/
  middleware.ts     # محافظت از /admin و /api/admin
  lib/
    db.ts           # Prisma client singleton
    auth.ts         # JWT helpers
    dataHelpers.ts  # تبدیل DB row به ساختار portfolio
    portfolio-data.ts # public data accessor با fallback

  app/
    api/
      auth/login    # POST /api/auth/login
      auth/logout   # POST /api/auth/logout
      admin/        # CRUD APIs (محافظت‌شده)
        projects/
        skills/
        experiences/
        blog/
        settings/
      projects/     # public GET API
    admin/          # UI پنل ادمین
      login/
      projects/
        new/
        [id]/
      skills/
      experiences/
      blog/
      settings/
      messages/
```

---

به امید موفقیت! 🚀
