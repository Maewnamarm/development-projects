'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';


const LoginPage: React.FC = () => {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = String(form.get('username') || '').trim();
    const password = String(form.get('password') || '');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      // พยายามอ่าน JSON ถ้าไม่ได้ค่อยอ่าน text
      let payload: any = null;
      const ctype = res.headers.get('content-type') || '';
      if (ctype.includes('application/json')) {
        payload = await res.json().catch(() => null);
      } else {
        const text = await res.text().catch(() => '');
        payload = { ok: false, message: text || 'Server returned non-JSON' };
      }

      if (!res.ok || !payload?.ok) {
        setErr(payload?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setLoading(false);
        return;
      }

      // สำเร็จ → ไปหน้า Admin/Site
      router.replace('/Admin/Site');
    } catch (error) {
      console.error('Login fetch failed:', error);
      setErr('มีปัญหาในการเชื่อมต่อเซิร์ฟเวอร์');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100">
      <div className="absolute inset-0">
        <Image src="/images/image1.jpg" alt="Background Image" fill priority className="z-0 object-cover" />
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
        <div className="bg-blue-800 py-4 text-white text-center text-xl font-bold">เข้าสู่ระบบ</div>
        <div className="p-8">
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="sr-only block text-sm font-medium text-gray-700">
                ชื่อผู้ใช้งาน
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="ชื่อผู้ใช้งาน (อีเมลหน่วยงาน)"
                required
                className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="sr-only block text-sm font-medium text-gray-700">
                รหัสผ่าน
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="รหัสผ่าน"
                required
                className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-md bg-blue-800 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? 'กำลังตรวจสอบ...' : 'ล็อกอิน'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
