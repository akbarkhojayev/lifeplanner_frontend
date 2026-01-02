# Habit Tracker Frontend

Bu loyiha Django backend bilan ishlash uchun React frontend hisoblanadi.

## Xususiyatlar

- 🔐 JWT Authentication
- 📅 Interaktiv kalendar
- 📊 Real-time statistika
- 🎯 Odatlarni boshqarish (CRUD)
- 📱 Responsive dizayn
- 🌟 Glass morphism UI
- 🖼️ Custom background image support
- 📈 Grafik tahlil paneli (Chart.js)
- ⌨️ Klaviatura boshqaruvi

## Texnologiyalar

- React 18
- React Router DOM
- Axios
- Lucide React (ikonlar)
- Date-fns (sana bilan ishlash)
- Chart.js & React-ChartJS-2 (grafiklar)

## O'rnatish

1. Dependencies o'rnatish:
```bash
cd frontend
npm install
```

2. Background rasm qo'shish (ixtiyoriy):
   - `background.jpg` faylini `frontend/public/` papkasiga joylashtiring
   - Rasm avtomatik ravishda orqa fon sifatida ishlatiladi

3. Backend serverni ishga tushiring (port 8000):
```bash
cd ..
python manage.py runserver
```

4. Frontend serverni ishga tushiring:
```bash
npm start
```

Frontend http://localhost:3000 da ochiladi.

## Background Image

Loyiha custom background image-ni qo'llab-quvvatlaydi:

1. `background.jpg` nomli rasm faylini `frontend/public/` papkasiga joylashtiring
2. Rasm avtomatik ravishda orqa fon sifatida ishlatiladi
3. Agar rasm mavjud bo'lmasa, gradient background ishlatiladi
4. Rasm ustiga 30% qora overlay qo'yiladi (o'qish uchun)

## Foydalanish

1. Login sahifasida admin/admin bilan kiring
2. Dashboard da "Odat qo'shish" tugmasini bosing
3. Yangi odat yarating
4. Kalendarda kunlarni bosib, odatlaringizni belgilang
5. **Tab** tugmasini bosib grafik panelini oching
6. Klaviatura orqali grafiklarni boshqaring
7. Statistika bo'limida taraqqiyotingizni kuzating

## Komponentlar

- `Login` - Autentifikatsiya
- `Dashboard` - Asosiy sahifa
- `Calendar` - Interaktiv kalendar
- `ChartsPanel` - Grafik tahlil paneli
- `HabitsList` - Odatlar ro'yxati
- `Statistics` - Statistika ko'rsatkichlari
- `AddHabitModal` - Yangi odat qo'shish
- `EditHabitModal` - Odatni tahrirlash
- `HabitLogModal` - Kun uchun odat belgilash
- `HabitStatsModal` - Odat statistikasi

## API Integration

Barcha API so'rovlar `src/services/api.js` orqali amalga oshiriladi:

- Authentication: `/api/token/`
- Habits: `/api/habits/`
- Habit Logs: `/api/habit-logs/`
- Dashboard: `/api/dashboard/`

## Dizayn

Loyiha glass morphism dizayn uslubida yaratilgan:
- Shaffof elementlar
- Blur effektlari
- Custom background image
- Gradient backgrounds
- Smooth animatsiyalar