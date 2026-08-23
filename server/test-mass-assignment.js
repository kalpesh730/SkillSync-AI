import { z } from 'zod';
import { validateRequest } from './validators/common.validator.js';

async function run() {
  const schema = z.object({
    body: z.object({
      name: z.string(),
      age: z.number(),
    }),
    query: z.object({
      search: z.string().optional(),
    }).optional(),
    params: z.object({
      id: z.string().optional(),
    }).optional(),
  });

  const middleware = validateRequest(schema);

  const req = {
    body: {
      name: 'Test',
      age: 25,
      tenantId: 'attacker-tenant',
      userId: 'attacker-user',
      role: 'admin',
      randomField: 'sneaky'
    },
    query: {
      search: 'foo',
      companyId: 'hacked'
    },
    params: {
      id: '123',
      extra: 'bad'
    }
  };

  const res = {
    status: (code) => {
      console.log('Error status:', code);
      return { json: (data) => console.log('Error response:', data) };
    }
  };

  const next = (err) => {
    if (err) {
      console.error('Next called with error:', err);
    } else {
      console.log('Next called successfully!');
      console.log('Sanitized body:', req.body);
      console.log('Sanitized query:', req.query);
      console.log('Sanitized params:', req.params);
    }
  };

  await middleware(req, res, next);
}

run().catch(console.error);
