import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authenticate } from '../middleware/auth';
import { validateBody, validateId } from '../middleware/validateRequest';

const router = Router();

router.get(
  '/',
  exerciseController.getAll.bind(exerciseController)
);

router.get(
  '/:id',
  validateId,
  exerciseController.getById.bind(exerciseController)
);

router.post(
  '/',
  authenticate,
  validateBody,
  exerciseController.create.bind(exerciseController)
);

router.patch(
  '/:id',
  authenticate,
  validateId,
  validateBody,
  exerciseController.update.bind(exerciseController)
);

router.delete(
  '/:id',
  authenticate,
  validateId,
  exerciseController.delete.bind(exerciseController)
);

export default router;