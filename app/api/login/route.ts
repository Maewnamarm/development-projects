// app/api/login/route.ts
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

    const username = rawUser.trim().toLowerCase();  // กันช่องว่าง/ตัวพิมพ์
    const password = rawPass;                       // ห้าม trim password

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

    // ค้นหา email แบบ case-insensitive
    const { data: officers, error: qErr } = await supabase
      .from('officer')
      .select('officer_id, agency_email, passwordhash')
      .ilike('agency_email', username);  // ilike = ไม่สนตัวพิมพ์

    if (qErr) {
      console.error('Query error:', qErr);
      return j({ ok: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' }, 500);
    }

    // เลือก record ที่ email ตรงแบบ case-insensitive (กันหลาย record)
    const officer = (officers ?? []).find(
      (o) => (o.agency_email ?? '').toLowerCase() === username
    );
    if (!officer) {
      return j({ ok: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, 401);
    }

    const hash = String(officer.passwordhash ?? '').trim();

    let passOk = false;
    if (hash.startsWith('$2')) {
      // bcrypt
      passOk = await bcrypt.compare(password, hash);
    } else if (hash.startsWith('$argon2')) {
      // ถ้าใน DB เป็น argon2 ให้แจ้งเปลี่ยนมาที่ bcrypt หรือเปลี่ยนโค้ดให้รองรับ argon2
      console.warn('Password hash is argon2; current code supports bcrypt only.');
      passOk = false;
    } else {
      // Fallback: เผื่อช่วงทดสอบยังเก็บ plaintext
      passOk = password === hash;
    }

    if (!passOk) {
      return j({ ok: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, 401);
    }

    // อัปเดตเวลาเข้าใช้งาน (optional)
    const { error: upErr } = await supabase
      .from('officer')
      .update({ login_time: new Date().toISOString() })
      .eq('officer_id', officer.officer_id);
    if (upErr) console.warn('Update login_time failed:', upErr);

    // TODO: ตั้ง session/cookie ที่นี่ (JWT + HttpOnly cookie) แล้วค่อยกันหน้า /Admin/*
    return j({ ok: true });
  } catch (e) {
    console.error('POST /api/login crashed:', e);
    return j({ ok: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' }, 500);
  }
}
