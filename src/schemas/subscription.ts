import { z } from 'zod';

const subscription = z.object({
  email: z.string().email(),
  type: z.enum(['subscribe', 'unsubscribe']),
});

export default {
  subscription,
};

export type SubscriptionInput = z.infer<typeof subscription>;
