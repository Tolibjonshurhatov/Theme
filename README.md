# Theme — Wallpaper Studio

Bu papkada Mac va Windows uchun ishlaydigan wallpaper dasturining to'liq kodi bor.
Dastur Electron texnologiyasida yozilgan — bitta kod bazasidan ham `.dmg` (Mac),
ham `.exe` (Windows) chiqadi.

## 0. Siz uchun: M3 Air'da qadamma-qadam

Sizda Mac (M3 Air) bo'lgani uchun `.dmg`ni to'liq o'zingiz, to'g'ridan-to'g'ri
o'sha kompyuterda yasashingiz mumkin. Terminal'ni oching va shu ketma-ketlikda
bajaring:

```bash
# 1) Node.js o'rnatilganini tekshiring (bo'lmasa nodejs.org dan yuklab oling)
node --version

# 2) Bu papkani (wallpaper-app) Desktop'ga yoki qulay joyga tashlang, so'ng:
cd ~/Desktop/wallpaper-app

# 3) Kerakli paketlarni o'rnating
npm install

# 4) Avval sinab ko'ring — dastur oynasi ochilishi kerak
npm start

# 5) Logotipni build/ papkasiga qo'yib bo'lgach, .dmg yasang
npm run build:mac
```

Natija: `dist/Theme-mac.dmg` — shu faylni saytingizdagi `downloads/` papkasiga
qo'ysangiz, "Download for Mac" tugmasi aynan shu faylni beradi. M3 Air'da
build qilingani uchun u avtomatik ravishda ham Apple Silicon (M seriya),
ham Intel Mac'larda ishlaydigan **universal** fayl bo'ladi (`--universal`
sozlamasi shuni ta'minlaydi).

`.exe` (Windows) uchun esa sizga Windows kompyuter yoki virtual mashina kerak
bo'ladi — buni pastda 3-bo'limda tushuntirib o'tganman.

## 1. Kompyuteringizda sinab ko'rish

Avval [Node.js](https://nodejs.org) (LTS versiya) o'rnatilgan bo'lishi kerak.

```bash
cd wallpaper-app
npm install
npm start
```

Shu buyruqdan keyin dastur oynasi ochiladi. Wallpaper tanlab, "O'rnatish" tugmasini
bosib sinab ko'rishingiz mumkin — haqiqatan ham kompyuteringiz fonini o'zgartiradi.

> Mac'da birinchi marta ishga tushirganda "System Events dasturga ekranni
> boshqarishga ruxsat berasizmi" degan so'rov chiqishi mumkin — ruxsat bering.

## 2. Mac uchun `.dmg` yasash (M1/M2/M3 va Intel — barchasi uchun)

**Muhim:** buni faqat **macOS kompyuterda** qilish mumkin (Linux yoki Windows'da
Mac uchun to'liq imzolangan build yasab bo'lmaydi).

```bash
npm run build:mac
```

`--universal` sozlamasi tufayli bitta `.dmg` fayl ham eski Intel Mac'larda,
ham yangi M-chip (M1/M2/M3/M4) Mac'larda ishlaydi — ikkita alohida fayl kerak emas.

Natija: `dist/Theme-mac.dmg`

### Gatekeeper haqida (muhim!)

Agar dasturni Apple Developer sertifikati bilan imzolamasangiz (code signing) va
notarize qilmasangiz, foydalanuvchi `.dmg`ni ochganda macOS "noma'lum dasturchi"
ogohlantirishini beradi va ular "System Settings → Privacy & Security" orqali
qo'lda ruxsat berishlari kerak bo'ladi. Buni butunlay olib tashlash uchun:
- Apple Developer akkaunti oching ($99/yil),
- `electron-builder`ga sertifikatingizni ulang,
- notarization sozlang (`electron-builder` buni avtomatlashtira oladi).

Boshida sinov uchun imzosiz ham tarqatishingiz mumkin, faqat foydalanuvchilarga
"ruxsat berish kerak" deb tushuntirish kerak bo'ladi.

## 3. Windows uchun `.exe` yasash

Windows kompyuterda yoki Mac/Linux'da ham (electron-builder Windows buildini
boshqa OS'lardan ham chiqara oladi, lekin eng ishonchlisi — Windows'ning o'zida):

```bash
npm run build:win
```

Natija: `dist/Theme-win.exe` (o'rnatuvchi — NSIS installer)

Windows'da ham SmartScreen ogohlantirishi chiqishi mumkin, agar dastur
imzolanmagan bo'lsa (bu yerda ham sertifikat sotib olish kerak bo'ladi —
narxi Apple'nikidan past).

## 4. Ikkalasini birga yasash

```bash
npm run build:all
```

## 5. Logotip — allaqachon joylashtirildi ✓

Siz yuborgan "T" logotipi endi barcha kerakli joylarga qo'yildi va formatlarga
o'tkazildi:

| Fayl | Holati |
|---|---|
| `build/icon.icns` | ✓ tayyor — Dock/Finder/.dmg ikonkasi |
| `build/icon.ico` | ✓ tayyor — Windows ikonkasi |
| `build/trayIconTemplate.png` / `@2x.png` | ✓ tayyor — Mac menu bar (qora silhouette versiyasi avtomatik yasaldi) |
| `website/logo.png`, `website/favicon.png` | ✓ tayyor — sayt logosi va favicon |
| `src/renderer/logo.png` | ✓ tayyor — dastur ichidagi yon panel logosi |

Boshqa hech narsa qilish shart emas — `npm run build:mac` buyrug'ini
ishga tushirsangiz, yasaladigan `.dmg` shu logotip bilan chiqadi.

Agar kelajakda logotipni almashtirmoqchi bo'lsangiz: yangi kvadrat (masalan
1024×1024) PNG faylni `build/icon-1024.png` o'rniga qo'yib, quyidagi buyruqni
qayta ishga tushirsangiz bo'ldi:

```bash
python3 -m icnsutil compose build/icon.icns build/icon-1024.png
```

(`icnsutil` kutubxonasi kerak bo'lsa: `pip install icnsutil`)

`build/` papkasida hozircha vaqtinchalik (placeholder) ikonkalar bor:
- `icon-1024.png` — asosiy logotip (buni o'zingiznikiga almashtiring)
- `trayIconTemplate.png` — Mac menu bar'da ko'rinadigan kichik ikonka

Ularni almashtirgandan keyin haqiqiy `.icns` (Mac) va `.ico` (Windows) formatlariga
o'tkazish kerak — buning uchun eng oson yo'l:
- https://cloudconvert.com/png-to-icns
- https://cloudconvert.com/png-to-ico

Natijadagi fayllarni `build/icon.icns` va `build/icon.ico` deb saqlang
(nomlari `package.json`dagi bilan mos bo'lishi kerak).

## 6. Haqiqiy wallpaperlarni qo'shish

Hozir `wallpapers/` papkasida faqat rangli gradient rasm-o'rinbosarlar bor (test
uchun). Haqiqiy rasmlarni qo'shish uchun:

1. `wallpapers/` papkasiga yangi `.jpg` fayl qo'shing (1920×1080 yoki undan katta,
   Retina uchun 3840×2160 tavsiya etiladi).
2. `src/renderer/renderer.js` faylidagi `CATALOG` obyektiga qo'shing:
   ```js
   'fayl-nomi.jpg': { cat: 'nature', name: 'Rasm nomi' },
   ```

**Litsenziya haqida ogohlantirish:** internetdan topilgan har qanday rasmni ishlatib
bo'lmaydi — mualliflik huquqi bor. Bepul va tarqatish uchun ruxsat etilgan rasmlar
uchun [Unsplash](https://unsplash.com) yoki [Pexels](https://pexels.com) kabi
saytlardan foydalaning (ularning litsenziyasi tijorat maqsadida ishlatishga ruxsat
beradi).

## Loyihaning tuzilishi

```
wallpaper-app/
├── package.json          ← build sozlamalari
├── src/
│   ├── main.js            ← asosiy jarayon: oyna, menu bar/tray, wallpaper o'rnatish
│   ├── preload.js          ← xavfsiz ko'prik (main ↔ renderer)
│   └── renderer/
│       ├── index.html      ← dastur interfeysi
│       └── renderer.js     ← interfeys logikasi
├── wallpapers/             ← rasm fayllari (hozir — test uchun gradientlar)
└── build/                  ← ikonkalar
```

## Sayt bilan bog'lash

`website/index.html` faylidagi yuklab olish tugmalari `downloads/Theme-mac.dmg`
va `downloads/Theme-win.exe`ga ishora qiladi. Sayt hostingiga `dist/` papkasidan
chiqqan fayllarni `downloads/` papkasi ichiga joylashtiring.
