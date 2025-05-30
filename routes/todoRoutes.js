import express from 'express';
import TodoController from '../controllers/todoController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, TodoController.create);
router.get('/', authMiddleware, TodoController.getAll);
router.put('/:id', authMiddleware, TodoController.update);
router.delete('/:id', authMiddleware, TodoController.delete);

export default router;