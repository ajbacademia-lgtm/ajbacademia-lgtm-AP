import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConfigurationProvider } from './context/ConfigurationContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { useVisitorTracking } from './hooks/useVisitorTracking';
import { CookieBanner } from './components/cookies/CookieBanner';
import { CookiePreferencesModal } from './components/cookies/CookiePreferencesModal';
import { CookieFloatingButton } from './components/cookies/CookieFloatingButton';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Journals } from './pages/Journals';
import { JournalPage } from './pages/Journal';
import { IssuePage } from './pages/Issue';
import { ArticlePage } from './pages/Article';
import { AdminPage } from './pages/Admin';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RegistrationSuccess } from './pages/RegistrationSuccess';
import { AdvancedSearch } from './pages/AdvancedSearch';
import { EditingServices } from './pages/EditingServices';
import { Contact } from './pages/Contact';
import { News } from './pages/News';
import { Solution } from './pages/Solution';
import { About } from './pages/About';
import { Company } from './pages/Company';
import { Leadership } from './pages/Leadership';
import { Careers } from './pages/Careers';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { CookiesPolicy } from './pages/Cookies';
import { Terms } from './pages/Terms';
import { Accessibility } from './pages/Accessibility';
import { ModernSlavery } from './pages/ModernSlavery';
import { BookAuthors } from './pages/BookAuthors';
import { JournalAuthors } from './pages/JournalAuthors';
import { Librarians } from './pages/Librarians';
import { Editors } from './pages/Editors';
import { Societies } from './pages/Societies';
import { CustomerSupport } from './pages/CustomerSupport';
import { RightsPermissions } from './pages/RightsPermissions';
import { RoyaltyRecipients } from './pages/RoyaltyRecipients';
import { SubjectArea } from './pages/SubjectArea';

import { UserRoles } from './pages/UserRoles';
import { SubmissionWorkflow } from './pages/SubmissionWorkflow';
import { ReviewManagement } from './pages/ReviewManagement';
import { PublicationModule } from './pages/PublicationModule';
import { AdminDashboards } from './pages/AdminDashboards';
import { AdminCookieDashboard } from './pages/AdminCookieDashboard';
import { AdminChatDashboard } from './pages/AdminChatDashboard';
import { AdminSubscriptionDashboard } from './pages/AdminSubscriptionDashboard';
import { NewsletterPage } from './pages/NewsletterPage';
import { PaymentGatewayBillingPage } from './pages/PaymentGatewayBillingPage';
import { SubmitManuscript } from './pages/SubmitManuscript';
import { SecurityCompliance } from './pages/SecurityCompliance';
import { Dashboard } from './pages/Dashboard';
import { AdminLogin } from './pages/AdminLogin';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { AuthorGuidelines } from './pages/AuthorGuidelines';
import { BeforeSubmit } from './pages/guidelines/BeforeSubmit';
import { SubmissionGuidelines } from './pages/guidelines/SubmissionGuidelines';
import { WritingManuscript } from './pages/guidelines/WritingManuscript';
import { FiguresVisuals } from './pages/guidelines/FiguresVisuals';
import { ReadySubmit } from './pages/guidelines/ReadySubmit';
import { PostPublication } from './pages/guidelines/PostPublication';
import { ExploreEnterprise } from './pages/ExploreEnterprise';
import { NotFound } from './pages/NotFound';

const AppContent: React.FC = () => {
  // Automatically track page views on route change
  useVisitorTracking();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="journals" element={<Journals />} />
          <Route path="journal/:id" element={<JournalPage />} />
          <Route path="issue/:id" element={<IssuePage />} />
          <Route path="article/:id" element={<ArticlePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="admindashboard/login" element={<AdminLogin />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="adminlogin" element={<AdminLogin />} />
          <Route path="register" element={<Register />} />
          <Route path="registration-success" element={<RegistrationSuccess />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="advanced-search" element={<AdvancedSearch />} />
          <Route path="editing-services" element={<EditingServices />} />
          <Route path="contact" element={<Contact />} />
          <Route path="news" element={<News />} />
          <Route path="author-guidelines" element={<AuthorGuidelines />} />
          <Route path="author-guidelines/before-submit" element={<BeforeSubmit />} />
          <Route path="author-guidelines/submission-guidelines" element={<SubmissionGuidelines />} />
          <Route path="author-guidelines/writing-manuscript" element={<WritingManuscript />} />
          <Route path="author-guidelines/figures-visuals" element={<FiguresVisuals />} />
          <Route path="author-guidelines/ready-to-submit" element={<ReadySubmit />} />
          <Route path="author-guidelines/post-publication" element={<PostPublication />} />
          <Route path="solution" element={<Solution />} />
          <Route path="explore-enterprise" element={<ExploreEnterprise />} />
          <Route path="about" element={<About />} />
          <Route path="user-roles" element={<UserRoles />} />
          <Route path="submission-workflow" element={<SubmissionWorkflow />} />
          <Route path="review-management" element={<ReviewManagement />} />
          <Route path="publication-module" element={<PublicationModule />} />
          <Route path="admindashboard" element={<AdminDashboards />} />
          <Route path="admindashboard/chats" element={<AdminChatDashboard />} />
          <Route path="admindashboard/chat" element={<AdminChatDashboard />} />
          <Route path="admindashboard/live-chat" element={<AdminChatDashboard />} />
          <Route path="admin/chats" element={<AdminChatDashboard />} />
          <Route path="admin/chat" element={<AdminChatDashboard />} />
          <Route path="admin/live-chat" element={<AdminChatDashboard />} />
          <Route path="admindashboard/subscribers" element={<AdminSubscriptionDashboard />} />
          <Route path="admindashboard/subscriptions" element={<AdminSubscriptionDashboard />} />
          <Route path="admindashboard/newsletter" element={<AdminSubscriptionDashboard />} />
          <Route path="admin/subscribers" element={<AdminSubscriptionDashboard />} />
          <Route path="admin/subscriptions" element={<AdminSubscriptionDashboard />} />
          <Route path="admin/newsletter" element={<AdminSubscriptionDashboard />} />
          <Route path="admindashboard/cookies" element={<AdminCookieDashboard />} />
          <Route path="admindashboard/cookie-dashboard" element={<AdminCookieDashboard />} />
          <Route path="admin/cookies" element={<AdminCookieDashboard />} />
          <Route path="admin/cookie-dashboard" element={<AdminCookieDashboard />} />
          <Route path="admindashboard/payment-gateway-billing" element={<PaymentGatewayBillingPage />} />
          <Route path="admin/payment-gateway-billing" element={<PaymentGatewayBillingPage />} />
          <Route path="admin/payment-billing" element={<PaymentGatewayBillingPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="subscribe" element={<NewsletterPage />} />
          <Route path="subscriptions" element={<NewsletterPage />} />
          <Route path="security-compliance" element={<SecurityCompliance />} />
          <Route path="submit" element={<SubmitManuscript />} />
          <Route path="company" element={<Company />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="careers" element={<Careers />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="cookies" element={<CookiesPolicy />} />
          <Route path="terms-and-conditions" element={<Terms />} />
          <Route path="accessibility" element={<Accessibility />} />
          <Route path="modern-slavery" element={<ModernSlavery />} />
          <Route path="book-authors" element={<BookAuthors />} />
          <Route path="journal-authors" element={<JournalAuthors />} />
          <Route path="librarians" element={<Librarians />} />
          <Route path="editors" element={<Editors />} />
          <Route path="societies" element={<Societies />} />
          <Route path="customer-support" element={<CustomerSupport />} />
          <Route path="rights-permissions" element={<RightsPermissions />} />
          <Route path="royalty-recipients" element={<RoyaltyRecipients />} />
          <Route path="subject/:slug" element={<SubjectArea />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      {/* Global Cookie Consent Components */}
      <CookieBanner />
      <CookiePreferencesModal />
      <CookieFloatingButton />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ConfigurationProvider>
      <AuthProvider>
        <CookieConsentProvider>
          <Router>
            <AppContent />
          </Router>
        </CookieConsentProvider>
      </AuthProvider>
    </ConfigurationProvider>
  );
};

export default App;
