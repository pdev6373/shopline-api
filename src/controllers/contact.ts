import { Request, Response } from 'express';
import { Contact } from '../models';

const contact = async (req: Request, res: Response) => {
  await Contact.create(req.body);

  res.json({
    success: true,
    message: 'Message sent',
  });
};

export default {
  contact,
};
