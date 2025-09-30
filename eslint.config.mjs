// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import path from "path";
// ไม่ต้อง import nextPlugin เพราะจะใช้ compat.extends("next/core-web-vitals")

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

// ใช้ FlatCompat ในการรวม configs และนำเข้า FlatConfig Array
export default [
  // 1. นำเข้า configs ดั้งเดิมของ Next.js และ TypeScript
  //    'next/core-web-vitals' รวม TypeScript Rules และ Next.js Rules ส่วนใหญ่ไว้แล้ว
  ...compat.extends("next/core-web-vitals"),

  // 2. กำหนด Rules/Overrides สำหรับไฟล์ TypeScript โดยเฉพาะ
  {
    files: ["**/*.{ts,tsx}"],
    // กำหนด parser และ parserOptions สำหรับการตรวจสอบ Type
    languageOptions: {
      // ใช้ tseslint.parser เพื่อให้มั่นใจว่าใช้ TypeScript Parser
      parser: tseslint.parser, 
      parserOptions: {
        // ใช้ path.resolve เพื่อให้มั่นใจว่า path ถูกต้อง
        project: [path.resolve(__dirname, "./tsconfig.json")],
        tsconfigRootDir: __dirname,
      },
    },
    // 3. กำหนด Rules ที่กำหนดเอง (Overrides)
    rules: {
      // Override Rules ของคุณ
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      
      // Rules ของ Next.js จะถูกจัดการโดย compat.extends("next/core-web-vitals")
      // แต่คุณสามารถ Override ได้ตรงนี้
      "@next/next/no-img-element": "warn", 
    },
  }
];