import { Router } from 'express';
import authRoutes from './auth.routes';
import fileRoutes from './file.routes';
import journalRoutes from './journal.routes';
import issueRoutes from './issue.routes';
import articleRoutes from './article.routes';
import userRoutes from './user.routes';
import newsRoutes from './news.routes';
import announcementRoutes from './announcement.routes';
import settingsRoutes from './settings.routes';
import visitorActivityRoutes from './visitorActivity.routes';
import cookieConsentRoutes from './cookieConsent.routes';
import liveChatRoutes from './liveChat.routes';
import aiRoutes from './ai.routes';
import subscriberRoutes from './subscriber.routes';
import geoRoutes from './geo.routes';

const apiRouter = Router();

// Authentication & Session Routes
apiRouter.use('/auth', authRoutes);

// Geolocation & Regional Routes
apiRouter.use('/geo', geoRoutes);

// Secure File Storage & Download Routes
apiRouter.use('/files', fileRoutes);

// Core Publishing Routes
apiRouter.use('/journals', journalRoutes);
apiRouter.use('/issues', issueRoutes);
apiRouter.use('/articles', articleRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/news', newsRoutes);
apiRouter.use('/announcements', announcementRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/visitor-activities', visitorActivityRoutes);
apiRouter.use('/cookie-consents', cookieConsentRoutes);
apiRouter.use('/live-chats', liveChatRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/subscribers', subscriberRoutes);
apiRouter.use('/newsletter', subscriberRoutes);

export default apiRouter;
