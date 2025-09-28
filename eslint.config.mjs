// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next"; // เปลี่ยนการ import ให้เป็น default import

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default tseslint.config(
  // **Option A: ใช้การตั้งค่า TypeScript และ Next.js ที่จำเป็น**
  {
    files: ["**/*.{ts,tsx}"],
    // เพิ่มการตั้งค่าของ TypeScript Linter ที่จำเป็น
    extends: [
      ...tseslint.configs.recommended, // การตั้งค่าพื้นฐานของ TypeScript
    ],
    // กำหนด plugins
    plugins: {
      "@next/next": nextPlugin,
    },
    // กำหนด parser ให้กับ TypeScript Files
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json"], // ตรวจสอบให้แน่ใจว่า path ถูกต้อง
      },
    },
    rules: {
      // เพิ่ม Rules ของ Next.js จาก nextPlugin
      ...nextPlugin.configs["recommended"].rules, // เพิ่ม Rules ที่แนะนำของ Next.js
      // Rules อื่น ๆ ของคุณ
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-img-element": "warn",
    },
  }
);