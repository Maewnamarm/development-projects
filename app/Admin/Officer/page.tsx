'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/supabase'
import bcrypt from 'bcryptjs'

interface Officer {
  id: number
  email: string
  agency: string
  created_at: string
}

// ฟังก์ชันลงทะเบียน officer
async function registerOfficer(email: string, password: string, agency: string) {
    try {
      const hashed = await bcrypt.hash(password, 10)
  
      // ✅ ใส่บรรทัดนี้แทน insert เดิม
      const { data, error } = await supabase
        .from('officers')
        .insert([{ email, password: hashed, agency, created_at: new Date() }])
  
      if (error) throw new Error(error.message || JSON.stringify(error))
  
      return data
    } catch (err: any) {
      // แสดงข้อความ error ชัดเจน
      throw new Error(err.message || JSON.stringify(err))
    }
}

// ฟังก์ชัน login officer
async function loginOfficer(email: string, password: string) {
  const { data: officer, error } = await supabase
    .from('officers')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !officer) throw new Error('User not found')

  const valid = await bcrypt.compare(password, officer.password)
  if (!valid) throw new Error('Invalid password')

  return officer as Officer
}

const OfficerLoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agency, setAgency] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const officer = await loginOfficer(email, password)
      setMessage(`✅ Login success: ${officer.email} (${officer.agency})`)
    } catch (err: any) {
      setMessage(`❌ Login failed: ${err.message}`)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage('❌ รหัสผ่านไม่ตรงกัน')
      return
    }

    if (!agency) {
      setMessage('❌ กรุณากรอกหน่วยงาน')
      return
    }

    try {
      await registerOfficer(email, password, agency)
      setMessage('✅ Register success! สามารถล็อกอินได้ทันที')
      setIsRegistering(false)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setAgency('')
    } catch (err: any) {
      setMessage(`❌ Register failed: ${err.message}`)
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
          priority
          className="z-0"
        />
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
        <div className="bg-blue-800 py-4 text-white text-center text-xl font-bold">
          {isRegistering ? 'ลงทะเบียนเจ้าหน้าที่' : 'เข้าสู่ระบบเจ้าหน้าที่'}
        </div>

        <div className="p-8">
          {isRegistering ? (
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

              <div className="mb-4">
                <input
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 text-black"
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="หน่วยงาน (Agency)"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
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
          ) : (
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
                  ลงทะเบียนเจ้าหน้าที่
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

export default OfficerLoginPage
