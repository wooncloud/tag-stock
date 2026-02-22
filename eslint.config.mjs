import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next의 기본 무시 항목을 재정의합니다.
  globalIgnores([
    // eslint-config-next의 기본 무시 항목:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Chrome Extension 빌드 결과물:
    'chrome_extansion/dist/**',
  ]),
]);

export default eslintConfig;
