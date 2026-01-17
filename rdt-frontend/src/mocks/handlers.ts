import { http, HttpResponse } from 'msw';

import { userHandlers } from './handlers/userHandlers';

export const handlers = [
  ...userHandlers,

  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    if (body.username === 'admin' && body.password === 'password') {
      return HttpResponse.json({
        code: 0,
        message: 'success',
        data: {
          token: 'fake-jwt-token',
          user: {
            id: 1,
            username: 'admin',
            role: 'ADMIN',
          },
        },
      });
    }

    return HttpResponse.json(
      {
        code: 11001,
        message: 'Invalid credentials',
      },
      { status: 401 }
    );
  }),
];
