module.exports = {
  forbidden: [
    /* =========================================
       1. Architecture Layers
       ========================================= */
    {
      name: 'no-utils-to-views',
      severity: 'error',
      comment: 'Architecture Violation: Utils layer should not depend on Views.',
      from: {
        path: '^src/utils',
      },
      to: {
        path: '^src/views',
      },
    },
    {
      name: 'no-api-to-views',
      severity: 'error',
      comment: 'Architecture Violation: API layer should not depend on Views.',
      from: {
        path: '^src/api',
      },
      to: {
        path: '^src/views',
      },
    },

    /* =========================================
       2. General Quality
       ========================================= */
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependency detected.',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Orphan file detected (not used by anyone).',
      from: {
        orphan: true,
        pathNot: [
          String.raw`\.d\.ts$`,
          String.raw`main\.tsx$`,
          String.raw`App\.tsx$`,
          String.raw`vite\.config\.ts$`,
          String.raw`tailwind\.config\.js$`,
          String.raw`postcss\.config\.js$`,
          String.raw`eslint\.config\.js$`,
          String.raw`\.html$`,
          String.raw`setupTests\.ts`,
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.app.json',
    },
  },
};
