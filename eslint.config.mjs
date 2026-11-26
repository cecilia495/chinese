import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([...next, ...nextTypeScript, globalIgnores([".next/**", "next-env.d.ts"])]);
