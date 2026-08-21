import { Router } from 'express';
import { IssueController } from '../controllers/issue.controller';
import { validateIdParam } from '../middleware/validate';

const router = Router();

router.get('/', IssueController.getIssues);
router.get('/journal/:journalId', validateIdParam('journalId'), IssueController.getIssuesByJournal);
router.get('/:id', validateIdParam('id'), IssueController.getIssueById);
router.post('/', IssueController.createIssue);
router.put('/:id', validateIdParam('id'), IssueController.updateIssue);
router.delete('/:id', validateIdParam('id'), IssueController.deleteIssue);

export default router;
