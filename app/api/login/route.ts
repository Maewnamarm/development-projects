// api/login/route.ts (Updated for required payload)
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function j(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUser = String(body?.username ?? '');
    const rawPass = String(body?.password ?? '');

    const username = rawUser.trim().toLowerCase();
    const password = rawPass;

    if (!username || !password) {
      return j({ ok: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' }, 400);
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      console.error('ENV not configured', { SUPABASE_URL: !!SUPABASE_URL, SERVICE_ROLE: !!SERVICE_ROLE });
      return j({ ok: false, message: 'Server env not configured' }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 1. ค้นหาข้อมูลผู้ใช้เบื้องต้น (รวมถึงรหัสแฮช)
    const { data: officers, error: qErr } = await supabase
      .from('officer')
      .select('officer_id, agency_email, passwordhash')
      .ilike('agency_email', username);

    if (qErr) {
      console.error('Query error:', qErr);
      return j({ ok: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์ขณะค้นหาผู้ใช้' }, 500);
    }

    const officer = (officers ?? []).find(
      (o) => (o.agency_email ?? '').toLowerCase() === username
    );
    if (!officer) {
      return j({ ok: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, 401);
    }

    const hash = String(officer.passwordhash ?? '').trim();

    // 2. ตรวจสอบรหัสผ่านด้วย bcrypt.compare() (ส่วนนี้ใช้เวลา)
    let passOk = false;
    if (hash.startsWith('$2')) {
      passOk = await bcrypt.compare(password, hash);
    } else if (hash.startsWith('$argon2')) {
      console.warn('Password hash is argon2; current code supports bcrypt only.');
      passOk = false;
    } else {
      passOk = password === hash;
    }

    if (!passOk) {
      return j({ ok: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, 401);
    }

    // 1. ดึงข้อมูลผู้ใช้ทั้งหมด (Select *)
    const { data: userData, error: userErr } = await supabase
      .from('officer')
      .select('*')
      .eq('officer_id', officer.officer_id)
      .single();

    if (userErr || !userData) {
      console.error('Failed to fetch full user data:', userErr);
      return j({ ok: false, message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้' }, 500);
    }

    // 2. ลบ passwordhash ออกจากข้อมูลที่จะส่งกลับ (เพื่อความปลอดภัย)
    const { passwordhash, ...userSafeData } = userData;

    // 3. อัปเดตเวลาเข้าสู่ระบบ (Update login_time)
    const { error: upErr } = await supabase
      .from('officer')
      .update({ login_time: new Date().toISOString() })
      .eq('officer_id', officer.officer_id);
    if (upErr) console.warn('Update login_time failed:', upErr);

    // 4. สร้าง Token อย่างง่าย (เนื่องจากไม่ได้ใช้ Supabase Auth ปกติ)
    // ใช้รูปแบบง่ายๆ ที่ไม่ซ้ำกันเพื่อใช้เป็น 'auth_token'
    const token = `OFT-${officer.officer_id}-${Date.now()}`; 

    // 5. ตอบกลับด้วย Token และ User Data ที่ Frontend คาดหวัง
    return j({ 
      ok: true, 
      token: token, 
      user: userSafeData 
    });

    } catch (e) {
    console.error('POST /api/login crashed:', e);
    return j({ ok: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' }, 500);
  }
}