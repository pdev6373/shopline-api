import { FAQ } from '@src/models';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IFAQ } from '@src/models/faq';

// GET FAQS
const getFaqs = async (req: Request, res: Response) => {
  const faqsByCategory = await FAQ.aggregate([
    {
      $group: {
        _id: {
          name: '$name',
          description: '$description',
        },
        faqs: {
          $push: {
            _id: '$_id',
            question: '$question',
            answer: '$answer',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id.name',
        description: '$_id.description',
        faqs: 1,
      },
    },
  ]);

  if (!faqsByCategory || !faqsByCategory.length)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'No FAQs found' });

  return res.json({
    success: true,
    data: faqsByCategory,
  });
};

// GET FAQ
const getFaq = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const faq: IFAQ | null = await FAQ.findById(id).lean();

  if (!faq)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'FAQ not found' });

  return res.json({
    success: true,
    data: faq,
  });
};

// ADD FAQ
const createFaq = async (req: Request, res: Response) => {
  const { categoryId, question, answer } = req.body;

  const existingFaq: IFAQ | null = await FAQ.findOne({ question, categoryId });

  if (existingFaq)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'FAQ already exist',
    });

  const newFaq: IFAQ = new FAQ({
    categoryId,
    question,
    answer,
  });

  await newFaq.save();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: newFaq,
  });
};

// UPDATE FAQ
const updateFaq = async (req: Request, res: Response) => {
  const { id, question, answer } = req.body;

  let faq: IFAQ | null = await FAQ.findById(id);

  if (!faq)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'FAQ not found' });

  const existingFAQ = await FAQ.findOne({
    question,
    categoryId: faq.categoryId,
  });

  if (existingFAQ)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'FAQ already exist' });

  faq.question = question;
  faq.answer = answer;

  await faq.save();

  return res.json({
    success: true,
    data: faq,
  });
};

// DELETE FAQ
const deleteFaq = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const deletedFAQ: IFAQ | null = await FAQ.findByIdAndDelete(id);

  if (!deletedFAQ)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Faq not found' });

  return res.json({ success: true, message: 'FAQ deleted' });
};

export default {
  getFaqs,
  getFaq,
  createFaq,
  updateFaq,
  deleteFaq,
};
