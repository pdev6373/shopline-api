import { z } from 'zod';

const contact = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  comments: z.string(),
});

export default {
  contact,
};

export type Contact = z.infer<typeof contact>;
