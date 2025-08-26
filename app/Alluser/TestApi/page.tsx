'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/supabase'

 // 👈 import supabase client

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(`❌ Login failed: ${error.message}`)
    } else {
      setMessage(`✅ Login success: ${data.session?.user.email}`)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage('❌ รหัสผ่านไม่ตรงกัน')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/Alluser/TestApi', // ลิงก์ที่จะไปหลังยืนยันอีเมล
      },
    })

    if (error) {
      setMessage(`❌ Register failed: ${error.message}`)
    } else {
      setMessage('✅ Register success! โปรดตรวจสอบอีเมลเพื่อยืนยันตัวตน')
      setIsRegistering(false)
    }
  }

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
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="อีเมล์"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 text-black"
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 text-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-800 px-4 py-2 text-white hover:bg-blue-700"
              >
                ล็อกอิน
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-600 hover:underline"
                >
                  ลงทะเบียน
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="อีเมล์"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 text-black"
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 text-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-800 px-4 py-2 text-white hover:bg-blue-700"
              >
                ลงทะเบียน
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-blue-600 hover:underline"
                >
                  กลับสู่หน้าเข้าสู่ระบบ
                </button>
              </div>
            </form>
          )}

          {message && (
            <div className="mt-4 text-center text-sm text-red-600">{message}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
