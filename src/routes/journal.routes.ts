import { Router } from 'express';
import { JournalController } from '../controllers/journal.controller';
import { validateIdParam } from '../middleware/validate';

const router = Router();

router.get('/', JournalController.getJournals);
router.get('/:id', validateIdParam('id'), JournalController.getJournalById);
router.post('/', JournalController.createJournal);
router.put('/:id', validateIdParam('id'), JournalController.updateJournal);
router.delete('/:id', validateIdParam('id'), JournalController.deleteJournal);

export default router;
