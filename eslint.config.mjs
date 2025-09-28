// 1. นำเข้าสิ่งที่ขาดหายไป
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import * as nextPlugin from "@next/eslint-plugin-next"; // ต้อง import nextPlugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname, // อาจจำเป็น
});

// 2. ส่งออก config โดยรวม compat.extends และ rules ใหม่
export default tseslint.config(
  // รวม extends จาก next/core-web-vitals และ next/typescript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // กำหนด rules เพิ่มเติมสำหรับไฟล์ TypeScript/TSX
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin, // ใช้ nextPlugin ที่ import เข้ามา
    },
    rules: {
      // ✅ ปิดการแจ้งเตือนสำหรับ any
      "@typescript-eslint/no-explicit-any": "off",
      // ✅ ปิดการแจ้งเตือนสำหรับตัวแปรที่ไม่ได้ใช้
      "@typescript-eslint/no-unused-vars": "off",
      // ✅ เปลี่ยน no-img-element เป็นแค่ warning แทน error
      "@next/next/no-img-element": "warn",
    },
  }
);