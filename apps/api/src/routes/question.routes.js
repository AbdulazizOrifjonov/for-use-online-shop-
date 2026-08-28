import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { listProductQuestions, createQuestion, answerQuestion, listAllQuestions, deleteQuestion } from '../controllers/question.controller.js';

const router = Router();

router.get('/all', authenticate, requireAdmin, listAllQuestions);
router.get('/:slug', listProductQuestions);
router.post('/:slug', authenticate, createQuestion);
router.patch('/:id/answer', authenticate, requireAdmin, answerQuestion);
router.delete('/:id', authenticate, requireAdmin, deleteQuestion);

export default router;
