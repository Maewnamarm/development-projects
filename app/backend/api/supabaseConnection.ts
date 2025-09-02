'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('ขาด Supabase URL หรือ Anon Key กรุณาตั้งค่าตัวแปรสภาพแวดล้อมของคุณ');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ดึงข้อมูลโปรเจกต์ทั้งหมดจากตาราง 'Projects' ใน Supabase
 * ฟังก์ชันนี้จะถูกเรียกจากคอมโพเนนต์ไคลเอนต์แต่จะทำงานบนเซิร์ฟเวอร์
 * @returns {Promise<any[] | null>} อาร์เรย์ของโปรเจกต์ หรือ null หากเกิดข้อผิดพลาด
 */
export async function getProjects() {
  // ตอนนี้เราอยู่บนเซิร์ฟเวอร์อย่างปลอดภัยแล้ว ที่ซึ่ง Supabase client สามารถทำงานได้
  // โดยไม่มีข้อขัดแย้งกับโค้ดฝั่งไคลเอนต์
  const { data, error } = await supabase
    .from('project')
    .select('proj_name, agency');

  if (error) {
    console.error('ข้อผิดพลาดในการดึงข้อมูลจาก Supabase:', error);
    return null;
  }

  return data;
}
