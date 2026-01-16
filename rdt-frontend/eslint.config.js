import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import pluginSecurity from 'eslint-plugin-security';
import pluginSonarjs from 'eslint-plugin-sonarjs';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginI18next from 'eslint-plugin-i18next';

import prettierConfig from 'eslint-config-prettier';
import pluginTailwindcss from 'eslint-plugin-better-tailwindcss';
import pluginCheckFile from 'eslint-plugin-check-file';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.d.ts',
      'auto-imports.d.ts',
      'components.d.ts',
      'postcss.config.js',
      'tailwind.config.ts',
      'tailwind.config.js',
      'eslint.config.js',
      '.dependency-cruiser.cjs',
    ],
  },
  // Base JS
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,

  // Security
  pluginSecurity.configs.recommended,

  // SonarJS
  pluginSonarjs.configs.recommended,

  // JSDoc
  pluginJsdoc.configs['flat/recommended-typescript-error'],

  // React
  {
    files: ['src/**/*.{ts,tsx}'],
    ...pluginReact.configs.flat.recommended,
    ...pluginReact.configs.flat['jsx-runtime'], // For React 17+ new JSX transform
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // React Hooks
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },

  // JSX A11y
  pluginJsxA11y.flatConfigs.recommended,

  // Prettier (must be last to override)
  prettierConfig,

  // Custom Configuration & Rules
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': pluginSimpleImportSort,
      // 'import': pluginImport, // eslint-plugin-import support for flat config is experimental/tricky, skipping for now as simple-import-sort handles sorting
      tailwindcss: pluginTailwindcss,
      'check-file': pluginCheckFile,
      i18next: pluginI18next,
    },
    settings: {
      'better-tailwindcss': {
        callees: ['classnames', 'clsx', 'ctl'],
        entryPoint: 'src/index.css', // Standard Vite React css entry
        cssFiles: ['src/index.css', 'src/App.css', '**/*.css', '!**/node_modules', '!**/dist'],
      },
    },
    rules: {
      // ==================== Tailwind CSS ====================
      'tailwindcss/no-unregistered-classes': 'off',
      'tailwindcss/no-duplicate-classes': 'warn',

      // ==================== Import Sorting ====================
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins
            [
              String.raw`^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)`,
            ],
            // React related packages
            [String.raw`^react`, String.raw`^react-dom`, String.raw`^react-router`],
            // Packages.
            [String.raw`^@?\w`],
            // Side effect imports.
            [String.raw`^\u0000`],
            // Internal packages.
            [String.raw`^(@|@api|@components|@utils|@hooks|@types)(/.*|$)`],
            // Parent imports. Put `..` last.
            [String.raw`^\.\.(?!/?$)`, String.raw`^\.\./?$`],
            // Other relative imports. Put same-folder imports and `.` last.
            [String.raw`^\./(?=.*/)`, String.raw`^\.(?!/?$)`, String.raw`^\./?$`],
            // Style imports.
            [String.raw`^.+\.s?css$`],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // ==================== TypeScript Strict ====================
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off', // In React components this can be verbose
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],

      // ==================== React Best Practices ====================
      'react/prop-types': 'off', // We use TypeScript
      'react/no-unknown-property': 'off', // Sometimes conflicts with some libraries or tailwind hacks, safe to off if TS checks it
      'react/self-closing-comp': 'error',
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],

      // ==================== I18n & Hardcoded Text ====================
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only', // Only check JSX text content, not attributes/props
          'should-validate-template': false,
          ignoreAttribute: [
            'className',
            'class',
            'style',
            'type',
            'id',
            'name',
            'data-testid',
            'data-cy',
            'to',
            'href',
            'target',
            'rel',
            'role',
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
            'placeholder', // Often needs i18n but can be noisy during skeleton phase
          ],
          ignoreComponent: ['Trans'], // i18next Trans component
          ignoreCallee: ['t', 'i18n.t', 'console.log', 'console.warn', 'console.error'],
        },
      ],

      // ==================== Global Restricted Objects ====================
      'no-restricted-globals': [
        'error',
        {
          name: 'alert',
          message: '请使用 ui.confirm 或 ui.alert (src/utils/ui.ts) 代替原生 alert。',
        },
        {
          name: 'confirm',
          message: '请使用 ui.confirm (src/utils/ui.ts) 代替原生 confirm。',
        },
        {
          name: 'prompt',
          message: '请使用 ui.prompt (src/utils/ui.ts) 代替原生 prompt。',
        },
        {
          name: 'Notification',
          message: '请使用 ui.notify (src/utils/ui.ts) 代替原生 Notification。',
        },
      ],

      // ==================== Restricted Syntax ====================
      'no-restricted-syntax': [
        'error',
        {
          selector: String.raw`Literal[value=/-\[/]`,
          message: '🚫 禁止使用 Tailwind CSS 任意值 (e.g. w-[100px])，请使用设计系统 Token。',
        },
        {
          selector: String.raw`JSXAttribute[name.name='className'] Literal[value=/-\[/]`,
          message: '🚫 禁止使用 Tailwind CSS 任意值 (e.g. w-[100px])，请使用设计系统 Token。',
        },
        {
          selector: String.raw`Literal[value=/[\u4e00-\u9fa5]/]`,
          message: '🚫 禁止硬编码中文，请使用 I18n 国际化 Key。',
        },
        {
          selector: String.raw`JSXText[value=/[\u4e00-\u9fa5]/]`,
          message: '🚫 禁止硬编码中文，请使用 I18n 国际化 Key。',
        },
        {
          selector: 'ExportDefaultDeclaration',
          message:
            '🚫 禁止使用 export default，请使用具名导出 (Named Exports) 以增强代码可追踪性和重构安全性。',
        },
      ],

      // ==================== Code Quality ====================
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      'sonarjs/void-use': 'off',

      // ==================== Naming Convention ====================
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/*.{tsx,jsx}': 'PASCAL_CASE', // React Comps PascalCase
          'src/**/*.{ts,js}': 'CAMEL_CASE', // Utils camelCase
          'src/hooks/use*.{ts,tsx}': 'CAMEL_CASE', // Hooks camelCase
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE',
        },
      ],
    },
  },
  // Node.js Scripts & Configs
  {
    files: ['scripts/**/*.js', '*.cjs', '*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off', // globals.node handles this, but sometimes needs explicit off if conflicts
      '@typescript-eslint/no-var-requires': 'off',
      'sonarjs/no-os-command-from-path': 'off',
      'sonarjs/prefer-regexp-exec': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  // Specific overrides
  {
    files: [
      'vite.config.ts',
      'vitest.config.ts',
      'tailwind.config.js',
      'postcss.config.js',
      'src/main.tsx',
    ],
    rules: {
      'no-console': 'off',
      'check-file/filename-naming-convention': 'off',
      'no-restricted-syntax': 'off',
    },
  }
);
