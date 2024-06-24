import { Request, Response } from 'express';

const update = async (req: Request, res: Response) => {
  res.json({
    success: true,
  });
};

export default {
  update,
};
