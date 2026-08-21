import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';
import { validateIdParam } from '../middleware/validate';

const router = Router();

router.get('/', AnnouncementController.getAnnouncements);
router.get('/:id', validateIdParam('id'), AnnouncementController.getAnnouncementById);
router.post('/', AnnouncementController.createAnnouncement);
router.put('/:id', validateIdParam('id'), AnnouncementController.updateAnnouncement);
router.delete('/:id', validateIdParam('id'), AnnouncementController.deleteAnnouncement);

export default router;
