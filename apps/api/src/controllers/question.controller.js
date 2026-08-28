import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listProductQuestions = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
  if (!product) throw new AppError('Product not found', 404, 'NOT_FOUND');

  const questions = await prisma.question.findMany({
    where: { productId: product.id },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ questions });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) throw new AppError('Question is required', 422, 'VALIDATION_ERROR');

  const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
  if (!product) throw new AppError('Product not found', 404, 'NOT_FOUND');

  const created = await prisma.question.create({
    data: { productId: product.id, userId: req.user.id, question },
    include: { user: { select: { id: true, name: true } } },
  });
  res.status(201).json({ question: created });
});

export const answerQuestion = asyncHandler(async (req, res) => {
  const { answer } = req.body;
  if (!answer) throw new AppError('Answer is required', 422, 'VALIDATION_ERROR');

  const question = await prisma.question.update({
    where: { id: req.params.id },
    data: { answer },
    include: { user: { select: { id: true, name: true } } },
  });
  res.json({ question });
});

export const listAllQuestions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', filter = 'all' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (filter === 'answered') where.answer = { not: null };
  if (filter === 'unanswered') where.answer = null;

  if (search) {
    where.OR = [
      { question: { contains: search } },
      { user: { name: { contains: search } } },
      { product: { nameUz: { contains: search } } },
    ];
  }

  const [questions, totalCount, answeredCount] = await Promise.all([
    prisma.question.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        product: {
          select: {
            id: true, nameUz: true, slug: true,
            images: { select: { url: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.question.count({ where }),
    prisma.question.count({ where: { answer: { not: null } } }),
  ]);

  const total = await prisma.question.count();

  res.json({
    questions,
    total,
    answeredCount,
    unansweredCount: total - answeredCount,
    pagination: {
      page: Number(page),
      pages: Math.ceil(totalCount / Number(limit)),
      total: totalCount,
    },
  });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  await prisma.question.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});
