import { createPlaygroundResult } from '@/lib/playground/message';
import { createServerFn } from '@tanstack/react-start';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

const playgroundInputSchema = z.object({
  message: z.string().trim().min(1, 'Write a message first.').max(280),
});

export const runPlaygroundFn = createServerFn({ method: 'POST' })
  .inputValidator(zodValidator(playgroundInputSchema))
  .handler(({ data }) => createPlaygroundResult(data.message));
