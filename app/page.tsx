'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Removed hasRedirected state for simplification, we can use a ref or rely on router.replace

  useEffect(() => {
    // Check if redirect is needed on mount
    const token = localStorage.getItem('auth_token');
    const userType = localStorage.getItem('user_type');
    
    if (userType === 'guest') {
      router.replace('/Alluser/Home');
      return;
    }
    
    if (token) {
      router.replace('/Admin/Site');
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = String(form.get('username') || '').trim();
    const password = String(form.get('password') || '');
    console.log(form)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
    console.log(res)
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
      console.log('Login successful payload:', payload);
      if (payload.token) {
        // บันทึก Token ลงใน Cookie
        Cookies.set('auth_token', payload.token, { 
            expires: 7, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
            path: '/' 
        });
        
        localStorage.setItem('user_data', JSON.stringify(payload.user));
        localStorage.removeItem('user_type'); 
    }
      router.replace('/Admin/Site');
    } catch (error) {
      console.error('Login fetch failed:', error);
      setErr('มีปัญหาในการเชื่อมต่อเซิร์ฟเวอร์');
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  
  localStorage.setItem('user_type', 'guest');
  
  router.push('/Alluser/Home');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100">
      <div className="absolute inset-0">
        <Image src="/images/image1.jpg" alt="Background Image" fill priority className="z-0 object-cover" />
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
        <div className="bg-blue-800 py-4 text-white text-center text-xl font-bold">เข้าสู่ระบบ</div>
        <div className="p-8">
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-2">
                ชื่อผู้ใช้งาน
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="อีเมลหน่วยงาน"
                required
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                รหัสผ่าน
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="กรอกรหัสผ่าน"
                required
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            {err && <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-800 px-4 py-3 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 mb-3"
            >
              {loading ? 'กำลังตรวจสอบ...' : 'ล็อกอิน'}
            </button>

            <div className="text-center">
              <div className="text-gray-600 text-sm mb-2">หรือ</div>
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full rounded-md bg-gray-600 px-4 py-3 text-white font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                เข้าสู่ระบบในฐานะผู้เข้าชม
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;