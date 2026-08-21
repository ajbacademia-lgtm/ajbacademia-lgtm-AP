import { Router } from 'express';
import { ArticleController } from '../controllers/article.controller';
import { validateIdParam } from '../middleware/validate';

const router = Router();

router.get('/', ArticleController.getArticles);
router.get('/journal/:journalId', validateIdParam('journalId'), ArticleController.getArticlesByJournal);
router.get('/issue/:issueId', validateIdParam('issueId'), ArticleController.getArticlesByIssue);
router.get('/:id', validateIdParam('id'), ArticleController.getArticleById);
router.post('/', ArticleController.createArticle);
router.put('/:id', validateIdParam('id'), ArticleController.updateArticle);
router.delete('/:id', validateIdParam('id'), ArticleController.deleteArticle);

export default router;
