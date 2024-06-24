import { z } from 'zod';

const update = z.object({});

type UpdateInput = z.infer<typeof update>;

export default {
  update,
};

export { UpdateInput };
