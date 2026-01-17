import { http, HttpResponse } from 'msw';

import type { CreateUserRequest, UpdateUserRequest, UserDTO } from '@/types/user';
import { UserStatus } from '@/types/user';

const API_BASE = '/api/v1';

// Mock Data
let users: UserDTO[] = Array.from({ length: 25 }, (_, i) => ({
  id: 1000 + i + 1,
  username: `user_${i + 1}`,
  email: `user_${i + 1}@example.com`,
  avatar: '',
  status: i % 5 === 0 ? UserStatus.LOCKED : UserStatus.ACTIVE,
  createdAt: new Date().toISOString(),
}));

export const userHandlers = [
  // GET /users (List)
  http.get(`${API_BASE}/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const size = Number(url.searchParams.get('size') || '10');
    const keyword = url.searchParams.get('keyword')?.toLowerCase();

    let filtered = [...users];

    if (keyword) {
      filtered = filtered.filter(
        (u) => u.username.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / size);
    const start = (page - 1) * size;
    const paged = filtered.slice(start, start + size);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        total,
        page,
        size,
        totalPages,
        content: paged,
      },
    });
  }),

  // GET /users/:id (Detail)
  http.get(`${API_BASE}/users/:id`, ({ params }) => {
    const { id } = params;
    const user = users.find((u) => u.id === Number(id));

    if (!user) {
      return HttpResponse.json(
        { code: 10002, message: 'User not found', data: null },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: user,
    });
  }),

  // POST /users (Create)
  http.post(`${API_BASE}/users`, async ({ request }) => {
    const body = (await request.json()) as CreateUserRequest;
    const newUser = {
      id: Date.now(),
      username: body.username,
      email: body.email,
      avatar: body.avatar || '',
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
    };
    users.unshift(newUser);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: newUser,
    });
  }),

  // PUT /users/:id (Update)
  http.put(`${API_BASE}/users/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as UpdateUserRequest;
    const index = users.findIndex((u) => u.id === Number(id));

    if (index === -1) {
      return HttpResponse.json(
        { code: 10002, message: 'User not found', data: null },
        { status: 404 }
      );
    }

    users[index] = { ...users[index], ...body };

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: users[index],
    });
  }),

  // DELETE /users/:id (Delete)
  http.delete(`${API_BASE}/users/:id`, ({ params }) => {
    const { id } = params;
    users = users.filter((u) => u.id !== Number(id));

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: null,
    });
  }),

  // POST /users/:id/reset-password
  http.post(`${API_BASE}/users/:id/reset-password`, () => {
    return HttpResponse.json({
      code: 0,
      message: 'Reset email sent (Mock)',
      data: null,
    });
  }),
];
