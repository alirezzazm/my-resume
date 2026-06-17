# 📸 آپلود عکس‌های پروژه

## نحوه‌ی کار

برای هر پروژه می‌تونی یک عکس واقعی (اسکرین‌شات یا ماک‌آپ) قرار بدی.

### مراحل:

1. **عکس رو در همین پوشه (`public/projects/`) قرار بده**
2. **اسم فایل باید مطابق با مقدار `image` در `src/data/portfolio.ts` باشه**

### نمونه:

برای پروژه‌ی Vitaping اپلیکیشن:

```
public/projects/vitaping-app.png
```

و در `portfolio.ts`:

```typescript
{
  id: 'vitaping-app',
  image: '/projects/vitaping-app.png',  // یا .jpg / .webp
  ...
}
```

## فرمت‌های پشتیبانی‌شده

- `.png` ✅ بهترین کیفیت
- `.jpg` ✅ سایز کوچک‌تر
- `.webp` ✅ مدرن‌ترین فرمت (پیشنهادی)
- `.svg` ✅ برای ماک‌آپ‌ها

## ابعاد توصیه‌شده

- **عرض**: 1200 پیکسل
- **ارتفاع**: 800 پیکسل
- **نسبت**: 3:2 یا 16:10

## برای اپلیکیشن‌های موبایل

اسکرین‌شات گوشی رو روی یک پس‌زمینه‌ی رنگی بذار (مثل ماک‌آپ‌های Apple/Android).
ابزار رایگان: [mockuphone.com](https://mockuphone.com)

## برای وب‌سایت‌ها

از مرورگر اسکرین‌شات بگیر یا از ابزار [browserframe.com](https://browserframe.com) استفاده کن.

## فایل‌های آماده الان موجود

- `vitaping-app.svg` (placeholder)
- `vitaping-web.svg` (placeholder)
- `motortrader.svg` (placeholder)
- `trustcode.svg` (placeholder)
- `nasirpdr.svg` (placeholder)
- `findjob.svg` (placeholder)

برای بقیه‌ی پروژه‌ها فعلاً placeholder خودکار از روی رنگ category نمایش داده می‌شه.
هر زمان عکسی اضافه کنی، خودکار جایگزین می‌شه.

## فایل‌های مورد نیاز برای کامل شدن همه‌ی پروژه‌ها:

```
hamdoreh.png          (وب)
daz.png               (وب)
ecommerce.png         (سازمانی)
trusti.png            (موبایل MAUI)
signal.png            (دسکتاپ)
office-auto.png       (سازمانی)
rfid.png              (دسکتاپ)
hardware.png          (دسکتاپ)
agility.png           (دسکتاپ)
faddy.png             (موبایل)
sys-access.png        (سازمانی)
accounting.png        (دسکتاپ)
insurance.png         (وب)
network.png           (دسکتاپ)
```

نگران نباش — اگه عکسی نباشه، کارت با آیکون و رنگ زیبا نمایش داده می‌شه. ✨
