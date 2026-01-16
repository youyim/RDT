import { afterAll, afterEach, beforeAll } from 'vitest';

import '@testing-library/jest-dom';

import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
