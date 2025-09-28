// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default tseslint.config(
  {
    files: ["**/*.{ts,tsx}"],
    // 1. นำเข้า Rules ที่แนะนำของ TypeScript แบบ Type-Checked
    extends: [
      ...tseslint.configs.recommendedTypeChecked, 
    ],
    plugins: {
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // ตรวจสอบให้แน่ใจว่าไฟล์ tsconfig.json ของคุณอยู่ในตำแหน่งที่ถูกต้อง
        project: ["./tsconfig.json"], 
      },
    },
    rules: {
      // 2. นำเข้า Rules ที่แนะนำของ Next.js
      ...nextPlugin.configs["recommended"].rules, 
      
      // 3. Rules ที่กำหนดเอง
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-img-element": "warn",
    },
  }
);