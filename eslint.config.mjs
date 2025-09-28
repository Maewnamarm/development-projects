// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next"; 
import path from "path"; // ต้อง import 'path' เพื่อใช้ path.resolve

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default tseslint.config(
  // 1. นำเข้า Rules ที่แนะนำของ Next.js และ TypeScript ผ่าน FlatCompat
  //    เพื่อให้มั่นใจว่าโครงสร้าง config ภายในทำงานถูกต้อง
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2. นำเข้า Rules ที่ต้องการการตรวจสอบ Type
  //    ใช้ tseslint.configs.recommendedTypeChecked โดยตรง (หากใช้งานได้)
  //    หรือใช้วิธีการรวม configuration objects (ซึ่งปลอดภัยกว่า)
  {
    files: ["**/*.{ts,tsx}"],
    // กำหนด parser และ parserOptions สำหรับการตรวจสอบ Type
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // ใช้ path.resolve เพื่อให้แน่ใจว่า path ไปที่ tsconfig.json ถูกต้อง
        project: [path.resolve(__dirname, "./tsconfig.json")],
        tsconfigRootDir: __dirname,
      },
    },
  },
  
  // 3. กำหนด Rules ที่กำหนดเอง (Overrides)
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin, // อาจไม่จำเป็นต้องระบุตรงนี้ถ้า compat.extends ทำงานแล้ว
    },
    rules: {
      // **สำคัญ:** หากคุณต้องการให้มี rules ของ tseslint.configs.recommendedTypeChecked
      // และยังไม่สามารถใช้ Spread ได้ ให้พิจารณาว่า rules ของ Next.js ก็ครอบคลุม TypeScript ด้วย
      
      // Override Rules ของคุณ
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-img-element": "warn",
    },
  }
);