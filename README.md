# Café Amazing — Front (Kiosk)

หน้าจอสั่งเครื่องดื่มแบบ touch screen สำหรับร้านกาแฟ Café Amazing
ตอนนี้เป็น **frontend อย่างเดียว + mock data** ยังไม่ต่อ backend จริง

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS
- Framer Motion (แอนิเมชัน) · lucide-react (ไอคอน)
- ฟอนต์: Fraunces (display) + Anuphan (ไทย/อังกฤษ)

## ฟีเจอร์

- เลือกหมวด (กาแฟ / ชา / นม / ปั่น / เบเกอรี่) แบบแตะ
- การ์ดเมนูขนาดใหญ่เหมาะกับจอสัมผัส
- ปรับแต่งเครื่องดื่ม (ร้อน-เย็น-ปั่น / ขนาด / ความหวาน / ท็อปปิ้ง) พร้อมคำนวณราคา
- ตะกร้าออเดอร์เรียลไทม์ เพิ่ม-ลดจำนวน
- หน้าชำระเงินจำลองด้วย **QR PromptPay + บาร์โค้ด** และสถานะ "ชำระเงินสำเร็จ"
- รองรับทั้งจอ landscape (kiosk) และมือถือ (ตะกร้าแบบ drawer)

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

> ข้อมูลเมนูทั้งหมดเป็น mock อยู่ที่ `lib/data.ts` — ภายหลังค่อยเปลี่ยนไปดึงจาก API ของ `cafe-amazing-back`
