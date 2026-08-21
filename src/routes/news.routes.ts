import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { validateIdParam } from '../middleware/validate';

const router = Router();

router.get('/', NewsController.getNews);
router.get('/:id', validateIdParam('id'), NewsController.getNewsById);
router.post('/', NewsController.createNews);
router.put('/:id', validateIdParam('id'), NewsController.updateNews);
router.delete('/:id', validateIdParam('id'), NewsController.deleteNews);

export default router;
