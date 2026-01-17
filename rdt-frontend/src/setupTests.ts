import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import '@testing-library/jest-dom';

import { server } from './mocks/server';

// Global i18n mock
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: 'zh-CN',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
