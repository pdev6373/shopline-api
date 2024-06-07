import { IFAQCategory } from '@src/models/faqCategory';
import { FAQCategory } from '@src/models';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

const createFaqCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const existingFaqCategory = await FAQCategory.findOne({ name });

  if (existingFaqCategory)
    return res.status(400).json({
      success: false,
      message: 'FAW category with this name already exists',
    });

  const newFaqCategory: IFAQCategory = new FAQCategory({
    name,
    description,
  });

  await newFaqCategory.save();

  return res.json({
    success: true,
    data: newFaqCategory,
  });
};

const updateFaqCategory = async (req: Request, res: Response) => {
  const { id, name, description } = req.body;

  let faqCategory: IFAQCategory | null = await FAQCategory.findById(id);

  if (!faqCategory)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'FAQ category not found' });

  faqCategory.name = name;
  faqCategory.description = description;

  await faqCategory.save();

  return res.json({
    success: true,
    data: faqCategory,
  });
};

const deleteFaqCategory = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const deletedFaqCategory: IFAQCategory | null =
    await FAQCategory.findByIdAndDelete(id);

  if (!deletedFaqCategory)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'FAQ category not found' });

  return res.json({ success: true, message: 'FAQ category deleted' });
};

export default { createFaqCategory, updateFaqCategory, deleteFaqCategory };
