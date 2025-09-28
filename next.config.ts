import type { NextConfig } from "next";

const nextConfig = {
  // สำหรับ Next.js 14 ขึ้นไป ควรใช้ remotePatterns แทน domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**', // อนุญาตทุก path
      },
      // ถ้ามีโดเมน Supabase Storage Bucket อื่นๆ ให้เพิ่มที่นี่
      // เช่น:
      // {
      //   protocol: 'https',
      //   hostname: 'xyz.supabase.co',
      //   port: '',
      //   pathname: '/storage/v1/object/public/your-bucket-name/**',
      // },
    ],
    // ถ้าใช้ Next.js เวอร์ชันเก่ากว่า 14 ให้ใช้ domains:
    // domains: ['placehold.co'], 
  },
  // ... การตั้งค่าอื่นๆ (ถ้ามี)
};

module.exports = nextConfig;
