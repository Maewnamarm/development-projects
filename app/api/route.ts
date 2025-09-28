// app/api/route.ts

// นำเข้า NextResponse เพื่อให้ Next.js รู้ว่าเป็น Route Handler
import { NextResponse } from 'next/server'; 

// ต้อง export ฟังก์ชัน handler ออกมา เช่น GET, POST
export async function GET(request: Request) {
  // คืนค่าการตอบกลับที่ถูกต้อง
  return NextResponse.json({ message: 'Hello from API route' });
}

// หรือถ้าคุณต้องการ POST
// export async function POST(request: Request) {
//   return NextResponse.json({ message: 'POST success' });
// }