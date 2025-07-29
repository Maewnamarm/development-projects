'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100">
      <div className="absolute inset-0">
        <Image
          src="/images/image1.jpg" 
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={80}
          priority={true}
          className="z-0"
        />
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
        <div className="bg-blue-800 py-4 text-white text-center text-xl font-bold">
          {isRegistering ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
        </div>

        <div className="p-8">
          {!isRegistering ? (
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="sr-only block text-sm font-medium text-gray-700">
                  ชื่อผู้ใช้งาน
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="ชื่อผู้ใช้งาน"
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="sr-only block text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="รหัสผ่าน"
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-800 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ล็อกอิน
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  ลงทะเบียน
                </button>
              </div>
            </form>
          ) : (
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="sr-only block text-sm font-medium text-gray-700">
                  อีเมล์
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="อีเมล์"
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="register-password" className="sr-only block text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  id="register-password"
                  name="register-password"
                  placeholder="รหัสผ่าน"
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirm-password" className="sr-only block text-sm font-medium text-gray-700">
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="ยืนยันรหัสผ่าน"
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div className="mb-4 flex items-center gap-2">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="กรอก OTP"
                  className="flex-grow rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  ส่ง OTP
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-800 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ลงทะเบียน
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  กลับสู่หน้าเข้าสู่ระบบ
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;