import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateIdParam } from '../middleware/validate';

const router = Router();

router.get('/', UserController.getUsers);
router.get('/:id', validateIdParam('id'), UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', validateIdParam('id'), UserController.updateUser);
router.delete('/:id', validateIdParam('id'), UserController.deleteUser);

export default router;
