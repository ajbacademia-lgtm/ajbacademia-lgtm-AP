import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart3, Users, User, Settings, ShieldCheck, Activity, PieChart, ArrowRight, CheckCircle2, AlertTriangle, Clock, Plus, Trash2, Edit, X, Book, Archive, ChevronLeft, Image, Upload, Newspaper, FileText, XCircle, Send, DollarSign, MapPin, Mail, Phone, Globe, Building, ExternalLink, CreditCard, Receipt, UserCheck, Share2, Linkedin, Twitter, Youtube, Facebook, Instagram, Cookie, MessageSquare, Radio } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfiguration, OfficeLocation, DEFAULT_CONTACT_CONFIG, DEFAULT_SOCIAL_LINKS } from '../context/ConfigurationContext';
import { MockService } from '../services/mockDb';
import { Journal, Issue, NewsItem, Article, ArticleStatus, JournalEditor } from '../types';
import { PaymentGatewaysManager } from '../components/admin/PaymentGatewaysManager';
import { BillingInvoicesManager } from '../components/admin/BillingInvoicesManager';
import { AdminAccessRequestsManager } from '../components/admin/AdminAccessRequestsManager';
import { RequestAdminAccessModal } from '../components/RequestAdminAccessModal';

const ADMIN_FEATURES = [
  {
    id: 'subscription-dashboard',
    title: 'Newsletter & Subscribers Hub',
    icon: <Mail size={32} />,
    color: 'bg-violet-50 text-violet-600',
    description: 'Manage academic newsletter subscribers, journal digest preferences, discipline segments, CSV data exports, and broadcast editorial announcements.',
    details: [
      'Real-time Subscriber Registry & Search Filter',
      'Audience Segments by Research Discipline',
      'Delivery Frequency (Weekly, Monthly, Alerts)',
      'Broadcast Digest & Call-for-Papers Campaigns',
      'CSV Export & 1-Click Status Toggles'
    ],
    link: '/admindashboard/subscribers'
  },
  {
    id: 'live-chat-dashboard',
    title: 'Live Chat & Customer Helpdesk',
    icon: <MessageSquare size={32} />,
    color: 'bg-blue-50 text-blue-600',
    description: 'Monitor real-time incoming visitor chats, respond as verified editorial staff, assign inquiries, and generate smart AI copilot draft replies.',
    details: [
      'Real-time Customer Chat Stream & Waiting Queue',
      'Editorial Staff Online / Offline Status Toggle',
      'AI-Powered Response Copilot with Gemini',
      'Visitor Metadata, Referrals & Inquiries Log'
    ],
    link: '/admindashboard/chats'
  },
  {
    id: 'cookie-dashboard',
    title: 'Website Cookies & Visitor Monitor',
    icon: <Cookie size={32} />,
    color: 'bg-emerald-50 text-emerald-600',
    description: 'Monitor real-time website visitor activity, scholarly readership, PDF downloads, keyword queries, and GDPR / ePrivacy cookie consent decisions.',
    details: [
      'Live Visitor Activity Stream & Audit Logs',
      'Cookie Consent Ratios & GDPR Analytics',
      'Article Views & PDF Download Metrics',
      'Cookie Policy & Banner Governance'
    ],
    link: '/admindashboard/cookies'
  },
  {
    id: 'social-config',
    title: 'Social Media Icons & Links',
    icon: <Share2 size={32} />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'Manage and update official social media URLs (LinkedIn, Twitter/X, YouTube, Facebook, Instagram) displayed in site footers and header links.',
    details: [
      'LinkedIn & Twitter/X Handles',
      'YouTube Channel & Media Links',
      'Facebook & Instagram Pages'
    ]
  },
  {
    id: 'payment-gateways',
    title: 'Payment Gateways & Credentials',
    icon: <CreditCard size={32} />,
    color: 'bg-amber-50 text-amber-600',
    description: 'Configure payment gateways (Stripe, PayPal, Paystack, Flutterwave, Crypto Wallet, Bank Transfer), set mode flags, and input API keys/secret credentials.',
    details: [
      'Stripe, PayPal, Paystack, Flutterwave',
      'Crypto Wallet (BTC, ETH, USDT, SOL)',
      'Bank Account Wire Transfer Setup',
      'API Key & Secret Vault Management'
    ],
    link: '/admindashboard/payment-gateway-billing'
  },
  {
    id: 'billing-invoices',
    title: 'Billing & Invoice History',
    icon: <Receipt size={32} />,
    color: 'bg-emerald-50 text-emerald-600',
    description: 'Manage article processing charge (APC) invoices, payment reminder schedules, official tax invoices, and settlement audit logs.',
    details: [
      'APC Invoice History & Tracking',
      'Automated & Manual Payment Reminders',
      'Custom Invoice Generation',
      'Printable Tax Invoice PDFs'
    ],
    link: '/admindashboard/payment-gateway-billing'
  },
  {
    id: 'admin-access-requests',
    title: 'Admin Access Requests',
    icon: <UserCheck size={32} />,
    color: 'bg-purple-50 text-purple-600',
    description: 'Review, approve, or reject administrative and editorial privilege applications submitted by faculty, managing editors, and financial officers.',
    details: [
      'Institutional Credential Audit',
      'Role Upgrades & Rights Provisioning',
      'ORCID iD & Faculty Verification',
      'Governance Action History'
    ]
  },
  {
    id: 'user-analytics',
    title: 'User Analytics',
    icon: <Users size={32} />,
    color: 'bg-blue-50 text-blue-600',
    description: 'Deep insights into user behavior, geographic distribution, and engagement across all Academic Publishing journals and platforms.',
    details: [
      'Real-time traffic monitoring',
      'Geographic readership heatmaps',
      'User retention & churn analysis',
      'Institutional access tracking'
    ]
  },
  {
    id: 'submission-metrics',
    title: 'Submission Metrics',
    icon: <BarChart3 size={32} />,
    color: 'bg-emerald-50 text-emerald-600',
    description: 'Comprehensive tracking of the manuscript pipeline, from initial submission to final publication or rejection.',
    details: [
      'Acceptance/Rejection rates',
      'Average time-to-decision',
      'Submission volume by discipline',
      'Author demographic reporting'
    ]
  },
  {
    id: 'editorial-workflows',
    title: 'Editorial Workflows',
    icon: <Settings size={32} />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'Centralized management of the peer-review process, allowing editors to monitor progress and identify bottlenecks.',
    details: [
      'Reviewer assignment tracking',
      'Editorial board performance',
      'Workflow stage automation',
      'Customizable review rubrics'
    ]
  },
  {
    id: 'content-moderation',
    title: 'Content Moderation',
    icon: <ShieldCheck size={32} />,
    color: 'bg-rose-50 text-rose-600',
    description: 'Advanced tools for ensuring research integrity, including plagiarism detection and ethical compliance monitoring.',
    details: [
      'Automated plagiarism screening',
      'Image integrity verification',
      'Conflict of interest tracking',
      'Ethics committee escalation'
    ]
  },
  {
    id: 'contact-config',
    title: 'Contact Us Manager',
    icon: <Mail size={32} />,
    color: 'bg-teal-50 text-teal-600',
    description: 'Edit contact info, office locations, permissions email, and response SLAs shown on the public Contact Us page.',
    details: [
      'Update Hero Title & Tagline',
      'Manage Global Office Locations',
      'Set Permissions & Support Emails',
      'Configure Response Time SLAs'
    ]
  },
  {
    id: 'site-config',
    title: 'Site Configuration',
    icon: <Settings size={32} />,
    color: 'bg-amber-50 text-amber-600',
    description: 'Manage global website appearance, branding, and core infrastructure settings.',
    details: [
      'Update Website Logo',
      'Site Name & Metadata',
      'System-wide Notifications',
      'Maintenance Mode'
    ]
  },
  {
    id: 'editors',
    title: 'Active Editors',
    icon: <Users size={32} />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'Manage journal editorial boards, member profiles, and institutional affiliations.',
    details: [
      'Assign Journal Editors',
      'Update Editor Bio/Affiliation',
      'Editorial Board Hierarchy',
      'Member Contact Directory'
    ]
  }
];

export const AdminDashboards: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { 
    settings, 
    updateLogo, 
    updateFavicon, 
    updateSiteName, 
    updateFooterInfo, 
    updateCopyrightYear, 
    updatePageContent,
    updateContactConfig,
    updateSocialLinks,
    addOfficeLocation,
    updateOfficeLocation,
    deleteOfficeLocation 
  } = useConfiguration();
  const isAdmin = authState.isAuthenticated && authState.user?.role === 'admin';
  
  const [selectedPageId, setSelectedPageId] = useState<string>('about');
  const [tempPageTitle, setTempPageTitle] = useState('');
  const [tempPageContent, setTempPageContent] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);

  // Social Media URLs State
  const socialLinks = settings.socialLinks || DEFAULT_SOCIAL_LINKS;
  const [socialLinkedin, setSocialLinkedin] = useState(socialLinks.linkedinUrl || '');
  const [socialTwitter, setSocialTwitter] = useState(socialLinks.twitterUrl || '');
  const [socialYoutube, setSocialYoutube] = useState(socialLinks.youtubeUrl || '');
  const [socialFacebook, setSocialFacebook] = useState(socialLinks.facebookUrl || '');
  const [socialInstagram, setSocialInstagram] = useState(socialLinks.instagramUrl || '');

  useEffect(() => {
    if (settings.socialLinks) {
      setSocialLinkedin(settings.socialLinks.linkedinUrl || '');
      setSocialTwitter(settings.socialLinks.twitterUrl || '');
      setSocialYoutube(settings.socialLinks.youtubeUrl || '');
      setSocialFacebook(settings.socialLinks.facebookUrl || '');
      setSocialInstagram(settings.socialLinks.instagramUrl || '');
    }
  }, [settings.socialLinks]);

  const handleSaveSocialLinks = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialLinks({
      linkedinUrl: socialLinkedin,
      twitterUrl: socialTwitter,
      youtubeUrl: socialYoutube,
      facebookUrl: socialFacebook,
      instagramUrl: socialInstagram,
    });
    showNotification('Social Media Profile URLs updated and published globally!', 'success');
  };

  const contactConfig = settings.contactConfig || DEFAULT_CONTACT_CONFIG;

  const [contactTitle, setContactTitle] = useState(contactConfig.title);
  const [contactSubtitle, setContactSubtitle] = useState(contactConfig.subtitle);
  const [contactSupportEmail, setContactSupportEmail] = useState(contactConfig.supportEmail || '');
  const [contactPermissionsEmail, setContactPermissionsEmail] = useState(contactConfig.permissionsEmail || '');
  const [contactResponseEmail, setContactResponseEmail] = useState(contactConfig.responseTimes?.email || '24-48 Hours');
  const [contactResponseQuotes, setContactResponseQuotes] = useState(contactConfig.responseTimes?.quotes || 'Within 12 Hours');
  const [contactResponseTech, setContactResponseTech] = useState(contactConfig.responseTimes?.tech || 'Same Day');
  const [contactFaqTitle, setContactFaqTitle] = useState(contactConfig.faqSectionTitle || 'Looking for something else?');
  const [contactFaqSubtitle, setContactFaqSubtitle] = useState(contactConfig.faqSectionSubtitle || 'Check out our specialized resources or browse our help center.');

  // Office Location Modal State
  const [showOfficeModal, setShowOfficeModal] = useState(false);
  const [editingOffice, setEditingOffice] = useState<OfficeLocation | null>(null);
  const [officeCity, setOfficeCity] = useState('');
  const [officeType, setOfficeType] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [officePhone, setOfficePhone] = useState('');

  useEffect(() => {
    if (settings.contactConfig) {
      setContactTitle(settings.contactConfig.title || 'Contact Us');
      setContactSubtitle(settings.contactConfig.subtitle || '');
      setContactSupportEmail(settings.contactConfig.supportEmail || '');
      setContactPermissionsEmail(settings.contactConfig.permissionsEmail || '');
      setContactResponseEmail(settings.contactConfig.responseTimes?.email || '24-48 Hours');
      setContactResponseQuotes(settings.contactConfig.responseTimes?.quotes || 'Within 12 Hours');
      setContactResponseTech(settings.contactConfig.responseTimes?.tech || 'Same Day');
      setContactFaqTitle(settings.contactConfig.faqSectionTitle || 'Looking for something else?');
      setContactFaqSubtitle(settings.contactConfig.faqSectionSubtitle || 'Check out our specialized resources or browse our help center.');
    }
  }, [settings.contactConfig]);

  const handleSaveContactConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactConfig({
      title: contactTitle,
      subtitle: contactSubtitle,
      supportEmail: contactSupportEmail,
      permissionsEmail: contactPermissionsEmail,
      responseTimes: {
        email: contactResponseEmail,
        quotes: contactResponseQuotes,
        tech: contactResponseTech
      },
      faqSectionTitle: contactFaqTitle,
      faqSectionSubtitle: contactFaqSubtitle
    });
    showNotification('Contact Us page settings updated successfully!', 'success');
  };

  const handleOpenOfficeModal = (office?: OfficeLocation) => {
    if (office) {
      setEditingOffice(office);
      setOfficeCity(office.city);
      setOfficeType(office.type);
      setOfficeAddress(office.address);
      setOfficePhone(office.phone);
    } else {
      setEditingOffice(null);
      setOfficeCity('');
      setOfficeType('Regional Office');
      setOfficeAddress('');
      setOfficePhone('');
    }
    setShowOfficeModal(true);
  };

  const handleSaveOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officeCity.trim()) return;
    if (editingOffice) {
      updateOfficeLocation(editingOffice.id, {
        city: officeCity,
        type: officeType,
        address: officeAddress,
        phone: officePhone
      });
      showNotification(`Office location "${officeCity}" updated successfully!`, 'success');
    } else {
      addOfficeLocation({
        city: officeCity,
        type: officeType,
        address: officeAddress,
        phone: officePhone
      });
      showNotification(`New office location "${officeCity}" added successfully!`, 'success');
    }
    setShowOfficeModal(false);
  };

  const handleDeleteOffice = (id: string, city: string) => {
    if (window.confirm(`Are you sure you want to delete office "${city}"?`)) {
      deleteOfficeLocation(id);
      showNotification(`Office "${city}" deleted.`, 'info');
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (settings.pages[selectedPageId]) {
      setTempPageTitle(settings.pages[selectedPageId].title);
      setTempPageContent(settings.pages[selectedPageId].content);
    }
  }, [selectedPageId, settings.pages]);

  const handleSavePage = () => {
    updatePageContent(selectedPageId, {
      title: tempPageTitle,
      content: tempPageContent
    });
    showNotification('Page content updated successfully!', 'success');
  };
  
  const [journals, setJournals] = useState<Journal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);

  // Archive Management State
  const [selectedJournalForArchive, setSelectedJournalForArchive] = useState<Journal | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  // Form State (Journal)
  const [title, setTitle] = useState('');
  const [issn, setIssn] = useState('');
  const [eissn, setEissn] = useState('');
  const [scopusIndexed, setScopusIndexed] = useState(false);
  const [indexingStr, setIndexingStr] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Science & Technology');
  const [subject, setSubject] = useState('Computer & Information Sciences');
  const [coverImage, setCoverImage] = useState('https://picsum.photos/400/600');

  // Form State (Issue)
  const [issueVolume, setIssueVolume] = useState('');
  const [issueNumber, setIssueNumber] = useState('');
  const [issueYear, setIssueYear] = useState('');
  const [issueMonth, setIssueMonth] = useState('');
  const [issueCover, setIssueCover] = useState('');
  const [issuePublished, setIssuePublished] = useState(true);

  // News Management State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsCategory, setNewsCategory] = useState('Innovation');
  const [newsImage, setNewsImage] = useState('');
  const [newsFeatured, setNewsFeatured] = useState(false);

  // Article Management State
  const [articles, setArticles] = useState<Article[]>([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleAbstract, setArticleAbstract] = useState('');
  const [articleKeywords, setArticleKeywords] = useState('');
  const [articleStatus, setArticleStatus] = useState<ArticleStatus>('Draft');
  const [articleJournalId, setArticleJournalId] = useState('');
  const [articleIssueId, setArticleIssueId] = useState('');
  const [articlePdfUrl, setArticlePdfUrl] = useState('');
  const [articleVolume, setArticleVolume] = useState('');
  const [articleIssue, setArticleIssue] = useState('');
  const [journalIssues, setJournalIssues] = useState<Issue[]>([]);
  const [uploadedArticlePdf, setUploadedArticlePdf] = useState<File | null>(null);
  const pdfInputRef = React.useRef<HTMLInputElement>(null);

  // Editor Management State
  const [editors, setEditors] = useState<JournalEditor[]>([]);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingEditor, setEditingEditor] = useState<JournalEditor | null>(null);
  const [editorName, setEditorName] = useState('');
  const [editorEmail, setEditorEmail] = useState('');
  const [editorAffiliation, setEditorAffiliation] = useState('');
  const [editorRole, setEditorRole] = useState('');
  const [editorJournalId, setEditorJournalId] = useState('');
  const [editorPhotoUrl, setEditorPhotoUrl] = useState('');

  useEffect(() => {
    if (isAdmin && articleJournalId) {
      MockService.getIssuesByJournal(articleJournalId).then(setJournalIssues);
    }
  }, [isAdmin, articleJournalId]);

  useEffect(() => {
    if (isAdmin) {
      MockService.getJournals().then(setJournals);
      MockService.getNews().then(setNews);
      MockService.getAllArticles().then(setArticles);
      
      // Fetch all editors
      MockService.getJournals().then(async (journals) => {
        const allEditors: JournalEditor[] = [];
        for (const journal of journals) {
          const journalEditors = await MockService.getEditorsByJournal(journal.id);
          allEditors.push(...journalEditors);
        }
        setEditors(allEditors);
      });
    }
  }, [isAdmin]);

  const handleOpenEditorModal = (editor?: JournalEditor) => {
    if (editor) {
      setEditingEditor(editor);
      setEditorName(editor.name);
      setEditorEmail(editor.email);
      setEditorAffiliation(editor.affiliation);
      setEditorRole(editor.role);
      setEditorJournalId(editor.journalId);
      setEditorPhotoUrl(editor.photoUrl || '');
    } else {
      setEditingEditor(null);
      setEditorName('');
      setEditorEmail('');
      setEditorAffiliation('');
      setEditorRole('');
      setEditorJournalId(journals[0]?.id || '');
      setEditorPhotoUrl('');
    }
    setShowEditorModal(true);
  };

  const handleSaveEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    const editorData: JournalEditor = {
      id: editingEditor?.id || `ed-${Date.now()}`,
      name: editorName,
      email: editorEmail,
      affiliation: editorAffiliation,
      role: editorRole,
      journalId: editorJournalId,
      photoUrl: editorPhotoUrl
    };

    try {
      if (editingEditor) {
        await MockService.updateEditor(editorData);
        setEditors(editors.map(ed => ed.id === editorData.id ? editorData : ed));
        showNotification(`Editor "${editorData.name}" updated successfully!`, 'success');
      } else {
        await MockService.createEditor(editorData);
        setEditors([...editors, editorData]);
        showNotification(`Editor "${editorData.name}" added successfully!`, 'success');
      }
      setShowEditorModal(false);
    } catch (err: any) {
      showNotification(`Operation failed: ${err.message || err}`, 'error');
    }
  };

  const handleDeleteEditor = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this editor?')) {
      try {
        await MockService.deleteEditor(id);
        setEditors(editors.filter(ed => ed.id !== id));
        showNotification('Editor removed successfully.', 'info');
      } catch (err: any) {
        showNotification(`Failed to remove editor: ${err.message || err}`, 'error');
      }
    }
  };

  // Load issues when a journal is selected for archive management
  useEffect(() => {
    if (selectedJournalForArchive) {
      MockService.getIssuesByJournal(selectedJournalForArchive.id)
        .then(setIssues)
        .catch(err => showNotification(`Failed to load issues: ${err.message}`, 'error'));
    }
  }, [selectedJournalForArchive]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'journal' | 'issue') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const serverUrl = await MockService.uploadFile(file);
        if (type === 'journal') {
          setCoverImage(serverUrl);
        } else {
          setIssueCover(serverUrl);
        }
      } catch (err: any) {
        showNotification(`File upload failed: ${err.message || err}`, 'error');
      }
    }
  };

  const handleArticlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedArticlePdf(file);
    }
  };

  const handleOpenModal = (journal?: Journal) => {
    if (journal) {
      setEditingJournal(journal);
      setTitle(journal.title);
      setIssn(journal.issn);
      setEissn(journal.eissn || 'Pending');
      setScopusIndexed(journal.scopusIndexed ?? false);
      setIndexingStr(journal.indexing ? journal.indexing.join(', ') : 'Scopus, Web of Science, DOAJ, Google Scholar, PubMed, Crossref, EBSCO, ProQuest');
      setDescription(journal.description);
      setCategory(journal.category || 'Science & Technology');
      setSubject(journal.subject || 'Computer & Information Sciences');
      setCoverImage(journal.coverImage);
    } else {
      setEditingJournal(null);
      setTitle('');
      setIssn('');
      setEissn('Pending');
      setScopusIndexed(false);
      setIndexingStr('Scopus, Web of Science, DOAJ, Google Scholar, PubMed, Crossref, EBSCO, ProQuest');
      setDescription('');
      setCategory('Science & Technology');
      setSubject('Computer & Information Sciences');
      setCoverImage('');
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const journalData: Journal = {
      id: editingJournal?.id || `j${Date.now()}`,
      title,
      issn,
      eissn,
      scopusIndexed,
      indexing: indexingStr.split(',').map(s => s.trim()).filter(Boolean),
      description,
      category,
      subject,
      coverImage: coverImage || 'https://picsum.photos/400/600?random=1'
    };

    try {
      if (editingJournal) {
        await MockService.updateJournal(journalData);
        setJournals(journals.map(j => j.id === journalData.id ? journalData : j));
        showNotification(`Journal "${journalData.title}" updated successfully!`, 'success');
      } else {
        await MockService.createJournal(journalData);
        setJournals([...journals, journalData]);
        showNotification(`New journal "${journalData.title}" was successfully created!`, 'success');
      }
      setShowModal(false);
    } catch (err: any) {
      showNotification(`Save failed: ${err.message || err}`, 'error');
    }
  };

  const handleCancelJournalEdit = () => {
    setShowModal(false);
    showNotification('Editing session cancelled. No changes were made.', 'info');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal?')) {
      try {
        await MockService.deleteJournal(id);
        setJournals(journals.filter(j => j.id !== id));
        showNotification('Journal deleted successfully.', 'info');
      } catch (err: any) {
        showNotification(`Delete failed: ${err.message || err}`, 'error');
      }
    }
  };

  // Issue Handlers
  const handleOpenIssueModal = (issue?: Issue) => {
    if (issue) {
      setEditingIssue(issue);
      setIssueVolume(issue.volume.toString());
      setIssueNumber(issue.number.toString());
      setIssueYear(issue.year.toString());
      setIssueMonth(issue.month || '');
      setIssueCover(issue.coverImage || '');
      setIssuePublished(issue.published);
    } else {
      setEditingIssue(null);
      setIssueVolume('');
      setIssueNumber('');
      setIssueYear(new Date().getFullYear().toString());
      setIssueMonth('');
      setIssueCover(`https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000)}`);
      setIssuePublished(true);
    }
    setShowIssueModal(true);
  };

  const handleSaveIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJournalForArchive) return;

    const issueData: Issue = {
      id: editingIssue?.id || `iss-${Date.now()}`,
      journalId: selectedJournalForArchive.id,
      volume: parseInt(issueVolume),
      number: parseInt(issueNumber),
      year: parseInt(issueYear),
      month: issueMonth,
      coverImage: issueCover,
      published: issuePublished
    };

    try {
      if (editingIssue) {
        await MockService.updateIssue(issueData);
        setIssues(issues.map(i => i.id === issueData.id ? issueData : i));
        showNotification('Issue updated successfully!', 'success');
      } else {
        await MockService.createIssue(issueData);
        setIssues([...issues, issueData]);
        showNotification('New issue created successfully!', 'success');
      }
      setShowIssueModal(false);
    } catch (err: any) {
      showNotification(`Save failed: ${err.message || err}`, 'error');
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await MockService.deleteIssue(id);
        setIssues(issues.filter(i => i.id !== id));
        showNotification('Issue deleted successfully.', 'info');
      } catch (err: any) {
        showNotification(`Delete failed: ${err.message || err}`, 'error');
      }
    }
  };

  // News Handlers
  const handleOpenNewsModal = (item?: NewsItem) => {
    if (item) {
      setEditingNews(item);
      setNewsTitle(item.title);
      setNewsExcerpt(item.excerpt);
      setNewsDate(item.date);
      setNewsCategory(item.category);
      setNewsImage(item.image);
      setNewsFeatured(item.featured || false);
    } else {
      setEditingNews(null);
      setNewsTitle('');
      setNewsExcerpt('');
      setNewsDate(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
      setNewsCategory('Innovation');
      setNewsImage('');
      setNewsFeatured(false);
    }
    setShowNewsModal(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const newsData: NewsItem = {
      id: editingNews?.id || `n${Date.now()}`,
      title: newsTitle,
      excerpt: newsExcerpt,
      date: newsDate,
      category: newsCategory,
      image: newsImage,
      featured: newsFeatured
    };

    try {
      if (editingNews) {
        await MockService.updateNews(newsData);
        setNews(news.map(n => n.id === newsData.id ? newsData : n));
        showNotification('News article updated successfully!', 'success');
      } else {
        await MockService.createNews(newsData);
        setNews([newsData, ...news]);
        showNotification('New news article published successfully!', 'success');
      }
      setShowNewsModal(false);
    } catch (err: any) {
      showNotification(`Save failed: ${err.message || err}`, 'error');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await MockService.deleteNews(id);
        setNews(news.filter(n => n.id !== id));
        showNotification('News article deleted.', 'info');
      } catch (err: any) {
        showNotification(`Delete failed: ${err.message || err}`, 'error');
      }
    }
  };

  const handleOpenArticleModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setArticleTitle(article.title);
      setArticleAbstract(article.abstract);
      setArticleKeywords(article.keywords.join(', '));
      setArticleStatus(article.status);
      setArticleJournalId(article.journalId);
      setArticleIssueId(article.issueId);
      setArticlePdfUrl(article.pdfUrl || '');
      setArticleVolume(article.volume?.toString() || '');
      setArticleIssue(article.issue?.toString() || '');
      setUploadedArticlePdf(null);
    } else {
      setEditingArticle(null);
      setArticleTitle('');
      setArticleAbstract('');
      setArticleKeywords('');
      setArticleStatus('Draft');
      setArticleJournalId(journals[0]?.id || '');
      setArticleIssueId('');
      setArticlePdfUrl('');
      setArticleVolume('');
      setArticleIssue('');
      setUploadedArticlePdf(null);
    }
    setShowArticleModal(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalPdfUrl = articlePdfUrl;
      if (uploadedArticlePdf) {
        finalPdfUrl = await MockService.uploadFile(uploadedArticlePdf);
      }

      const articleData: Article = {
        id: editingArticle?.id || `art${Date.now()}`,
        title: articleTitle,
        abstract: articleAbstract,
        keywords: articleKeywords.split(',').map(k => k.trim()).filter(k => k),
        status: articleStatus,
        journalId: articleJournalId,
        issueId: articleIssueId,
        pdfUrl: finalPdfUrl,
        authors: editingArticle?.authors || [],
        pageStart: editingArticle?.pageStart || 0,
        pageEnd: editingArticle?.pageEnd || 0,
        views: editingArticle?.views || 0,
        downloads: editingArticle?.downloads || 0,
        doi: editingArticle?.doi || `10.1000/art.${Date.now()}`,
        submissionDate: editingArticle?.submissionDate || new Date().toISOString().split('T')[0],
        volume: articleVolume,
        issue: articleIssue
      };

      if (editingArticle) {
        await MockService.updateArticle(articleData);
        setArticles(articles.map(a => a.id === articleData.id ? articleData : a));
        showNotification('Article updated successfully!', 'success');
      } else {
        await MockService.createArticle(articleData);
        setArticles([articleData, ...articles]);
        showNotification('New article created successfully!', 'success');
      }
      setUploadedArticlePdf(null);
      setShowArticleModal(false);
    } catch (err: any) {
      showNotification(`Save failed: ${err.message || err}`, 'error');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await MockService.deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
        showNotification('Article deleted successfully.', 'info');
      } catch (err: any) {
        showNotification(`Delete failed: ${err.message || err}`, 'error');
      }
    }
  };

  const updateArticleStatus = async (article: Article, newStatus: ArticleStatus) => {
    try {
      const updated = { ...article, status: newStatus };
      await MockService.updateArticle(updated);
      setArticles(articles.map(a => a.id === article.id ? updated : a));
      showNotification(`Article status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      showNotification(`Failed to update status: ${err.message || err}`, 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-brand-navy p-12 rounded-sm shadow-2xl border border-white/5 text-center">
          <div className="w-20 h-20 bg-brand-action/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="text-brand-action" size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-6 uppercase tracking-tight">Access Restricted</h2>
          <p className="text-white/60 mb-10 leading-relaxed max-w-md mx-auto">
            You have reached the Global Governance Console. This area is reserved for verified platform administrators and section editors.
          </p>
          
          <div className="mb-10 max-w-md mx-auto">
            <p className="text-[10px] text-white/30 italic leading-relaxed text-center">
              Platform administrators can oversee journal portfolios, manuscript flows, and user permissions from this portal. 
              Please authenticate with your official staff credentials to continue.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/admindashboard/login"
              className="px-8 py-3.5 bg-brand-action text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white hover:text-brand-navy transition-all shadow-lg"
            >
              Authenticate now
            </Link>

            <button
              onClick={() => setShowRequestAccessModal(true)}
              className="px-8 py-3.5 bg-purple-700 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-purple-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <UserCheck size={16} /> Request Admin Access
            </button>
          </div>

          <RequestAdminAccessModal 
            isOpen={showRequestAccessModal} 
            onClose={() => setShowRequestAccessModal(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen relative">
      {/* Dynamic Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[200] max-w-sm w-full bg-white border-l-4 border-brand-action shadow-2xl p-4 rounded-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-4">
            {notification.type === 'success' ? (
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            ) : notification.type === 'error' ? (
              <XCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
            ) : (
              <Activity className="text-brand-action shrink-0 mt-0.5" size={18} />
            )}
            <div className="flex-grow">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">
                {notification.type === 'success' ? 'System Saved' : notification.type === 'error' ? 'Operational Failure' : 'Action Cancelled'}
              </p>
              <p className="text-xs font-semibold text-brand-navy mt-1 leading-relaxed">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-brand-navy/30 hover:text-brand-navy p-1 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Platform Governance</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-6">🔹 Admin Dashboards</h1>
          <p className="text-lg text-brand-navy/60 max-w-2xl mx-auto leading-relaxed">
            Empowering editors and administrators with real-time data and advanced management tools to oversee the entire publishing ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/admindashboard/chats"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-sm shadow-md transition-all flex items-center gap-2"
            >
              <MessageSquare size={16} /> Open Live Chat & Helpdesk Console <ArrowRight size={14} />
            </Link>

            <Link
              to="/admindashboard/cookies"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-sm shadow-md transition-all flex items-center gap-2"
            >
              <Cookie size={16} /> Open Dedicated Cookie & Visitor Dashboard <ArrowRight size={14} />
            </Link>

            <Link
              to="/admindashboard/payment-gateway-billing"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-widest rounded-sm shadow-md transition-all flex items-center gap-2"
            >
              <CreditCard size={16} /> Open Dedicated Payment Gateway & Billing Page <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Access Requests Section */}
      <section id="admin-access-requests-section" className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <AdminAccessRequestsManager />
        </div>
      </section>

      {isAdmin && !selectedJournalForArchive && (
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 text-brand-action mb-4">
                  <Book size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Inventory Hub</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Journal Portfolio</h2>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  Oversee your entire collection of journals and publications. Edit metadata, manage archives, or add new journals to the platform.
                </p>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all w-fit shadow-lg"
              >
                <Plus size={16} /> Add New Journal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {journals.map(journal => (
                <div key={journal.id} className="group relative bg-[#fcfcfc] border border-gray-100 p-8 rounded-sm hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-32 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0 shadow-lg border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                      <img src={journal.coverImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-[10px] font-black text-brand-action uppercase tracking-widest mb-2">{journal.category}</div>
                      <h3 className="font-serif font-bold text-brand-navy leading-tight text-lg mb-2 group-hover:text-brand-action transition-colors">{journal.title}</h3>
                      <div className="text-[10px] font-mono text-brand-navy/40 mb-4 uppercase tracking-[0.2em]">{journal.issn}</div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <button 
                          onClick={() => handleOpenModal(journal)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-brand-navy text-[9px] font-black uppercase tracking-wider rounded hover:bg-brand-action hover:text-white transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => setSelectedJournalForArchive(journal)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy/10 text-brand-navy text-[9px] font-black uppercase tracking-wider rounded hover:bg-brand-navy hover:text-white transition-colors"
                          title="Archive & Issues"
                        >
                          <Archive size={12} /> Issues
                        </button>
                        <button 
                          onClick={() => handleDelete(journal.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-wider rounded hover:bg-rose-600 hover:text-white transition-colors"
                          title="Delete Journal"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                           <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                           </div>
                        ))}
                     </div>
                     <span className="text-[9px] font-bold text-brand-navy/30 uppercase tracking-widest">Active Editors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isAdmin && selectedJournalForArchive && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-6">
            <button 
              onClick={() => setSelectedJournalForArchive(null)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-navy/40 hover:text-brand-navy mb-8"
            >
              <ChevronLeft size={16} /> Back to Journals
            </button>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-20 shadow-lg rounded-sm overflow-hidden flex-shrink-0">
                  <img src={selectedJournalForArchive.coverImage} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-navy tracking-tight">{selectedJournalForArchive.title}</h2>
                  <p className="text-sm text-brand-navy/50 font-mono italic uppercase tracking-wider">Issue Management & Publication Archive — {selectedJournalForArchive.issn}</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpenIssueModal()}
                className="flex items-center gap-2 px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all shadow-lg"
              >
                <Plus size={16} /> Register New Issue
              </button>
            </div>

            <div className="bg-gray-50 rounded-sm border border-gray-100 overflow-hidden shadow-xl ring-1 ring-black/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-5 border-r border-white/10">Volume / No.</th>
                    <th className="px-6 py-5 border-r border-white/10">Year / Month</th>
                    <th className="px-6 py-5 border-r border-white/10">Publication Status</th>
                    <th className="px-6 py-5 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {issues.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-brand-navy/40 text-sm italic">
                        No issues found in this journal's archive.
                      </td>
                    </tr>
                  ) : (
                    issues.sort((a,b) => b.year - a.year || b.volume - a.volume || b.number - a.number).map(issue => (
                      <tr key={issue.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-5 border-r border-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-10 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0 shadow-sm">
                              <img src={issue.coverImage} className="w-full h-full object-cover" alt="" />
                            </div>
                            <span className="font-serif font-bold text-brand-navy text-sm">Vol. {issue.volume}, No. {issue.number}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 border-r border-gray-50 text-sm text-brand-navy/60 font-medium">
                          {issue.year} {issue.month && `/ ${issue.month}`}
                        </td>
                        <td className="px-6 py-5 border-r border-gray-50">
                          {issue.published ? (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-sm border border-emerald-100">Published</span>
                          ) : (
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-sm border border-amber-100 text-nowrap">Manuscript Only</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                             <button 
                               onClick={() => handleOpenIssueModal(issue)}
                               className="px-3 py-1.5 text-brand-navy/40 hover:text-brand-action hover:bg-white rounded transition-all text-[10px] font-black uppercase flex items-center gap-1.5"
                               title="Update Issue"
                             >
                               <Edit size={14} /> Update
                             </button>
                             <button 
                               onClick={() => handleDeleteIssue(issue.id)}
                               className="px-3 py-1.5 text-brand-navy/40 hover:text-red-600 hover:bg-white rounded transition-all text-[10px] font-black uppercase flex items-center gap-1.5"
                               title="Delete Issue"
                             >
                               <Trash2 size={14} /> Delete
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Manuscript & Publication Control Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-brand-action mb-4">
                <FileText size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Publication Pipeline</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Manuscript & Publication Control</h2>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                Management hub for submitted research. Edit article metadata, update publication status, and oversee the transition from manuscript to published record.
              </p>
            </div>
            <button 
              onClick={() => handleOpenArticleModal()}
              className="flex items-center gap-2 px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all w-fit shadow-lg shadow-brand-navy/10"
            >
              <Plus size={16} /> Add New Publication
            </button>
          </div>

          <div className="bg-white rounded-sm shadow-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Publication Detail</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Journal Portfolio</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Lifecycle Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Reg. Date</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-brand-navy/40 text-sm italic">
                        No manuscripts found in the pipeline.
                      </td>
                    </tr>
                  ) : (
                    articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50/80 group transition-colors">
                        <td className="px-6 py-6 border-r border-gray-50">
                          <div className="max-w-xs md:max-w-md">
                            <h4 className="font-serif font-bold text-brand-navy text-base mb-2 leading-tight group-hover:text-brand-action transition-colors">{article.title}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              {article.volume && article.issue ? (
                                <span className="text-[9px] font-black uppercase tracking-widest bg-brand-action/10 text-brand-action px-2 py-0.5 rounded">
                                  Vol. {article.volume}, Issue {article.issue}
                                </span>
                              ) : (
                                <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-2 py-0.5 rounded">
                                  Unassigned
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-brand-navy/50 font-medium">
                              AUTHORS: {article.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-50">
                          <div className="text-[10px] font-black text-brand-navy/80 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded inline-block">
                            {journals.find(j => j.id === article.journalId)?.title || 'Unknown Journal'}
                          </div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-50">
                          <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm ${
                            article.status === 'Published' ? 'bg-emerald-50 text-emerald-600' :
                            article.status === 'Accepted' ? 'bg-blue-50 text-brand-navy' :
                            article.status === 'Paid' ? 'bg-purple-50 text-purple-600' :
                            article.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                            article.status === 'In Review' ? 'bg-indigo-50 text-indigo-600' :
                            'bg-gray-100 text-brand-navy/40'
                          }`}>
                            {article.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-[10px] font-mono text-brand-navy/40 border-r border-gray-50">
                          {article.submissionDate || 'N/A'}
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            {article.status === 'Draft' || article.status === 'Submitted' ? (
                              <button 
                                onClick={() => updateArticleStatus(article, 'In Review')}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                                title="Move to Review"
                              >
                                <Activity size={16} />
                              </button>
                            ) : null}
                            {article.status === 'In Review' ? (
                              <>
                                <button 
                                  onClick={() => updateArticleStatus(article, 'Accepted')}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"
                                  title="Accept Manuscript"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                                <button 
                                  onClick={() => updateArticleStatus(article, 'Rejected')}
                                  className="p-2 text-rose-600 hover:bg-rose-50 rounded"
                                  title="Reject Publication"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            ) : null}
                            {article.status === 'Accepted' ? (
                               <button 
                                 onClick={() => updateArticleStatus(article, 'Paid')}
                                 className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                                 title="Mark as Paid"
                               >
                                 <DollarSign size={16} />
                               </button>
                            ) : null}
                            {article.status === 'Paid' ? (
                               <button 
                                 onClick={() => updateArticleStatus(article, 'Published')}
                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                 title="Publish Now"
                               >
                                 <Send size={16} />
                               </button>
                            ) : null}
                            <div className="h-6 w-px bg-gray-200 mx-1"></div>
                            <button 
                              onClick={() => handleOpenArticleModal(article)}
                              className="p-2 text-brand-navy/40 hover:text-brand-action rounded flex items-center gap-1 text-[10px] font-black uppercase"
                              title="Update Publication"
                            >
                              <Edit size={16} /> <span className="hidden lg:inline">Update</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteArticle(article.id)}
                              className="p-2 text-brand-navy/40 hover:text-red-600 rounded flex items-center gap-1 text-[10px] font-black uppercase"
                              title="Delete Publication"
                            >
                              <Trash2 size={16} /> <span className="hidden lg:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* News Management Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-brand-action mb-4">
                <Newspaper size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Communication Hub</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">News & Announcements</h2>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                Publish platform updates, partnership announcements, and industry news. Managing the external voice of Academic Publishing.
              </p>
            </div>
            <button 
              onClick={() => handleOpenNewsModal()}
              className="flex items-center gap-2 px-6 py-3 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all w-fit shadow-lg shadow-brand-navy/10"
            >
              <Plus size={16} /> Create News Story
            </button>
          </div>

          <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Story</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 group transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="max-w-md">
                            <div className="font-bold text-brand-navy text-sm leading-tight mb-1">{item.title}</div>
                            <div className="text-[10px] text-brand-navy/40 line-clamp-1 italic">{item.excerpt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-widest">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-brand-navy/40 font-mono">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">
                        {item.featured ? (
                          <span className="text-brand-action">★ Featured</span>
                        ) : (
                          <span className="text-brand-navy/30">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => handleOpenNewsModal(item)}
                             className="p-1.5 text-brand-navy/40 hover:text-brand-action transition-colors"
                           >
                             <Edit size={14} />
                           </button>
                           <button 
                             onClick={() => handleDeleteNews(item.id)}
                             className="p-1.5 text-brand-navy/40 hover:text-red-600 transition-colors"
                           >
                             <Trash2 size={14} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Site Configuration Section */}
      <section id="site-config-section" className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-12">
            <div className="flex items-center gap-3 text-brand-action mb-4">
              <Settings size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Preferences</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Site Configuration</h2>
            <p className="text-brand-navy/60 text-sm leading-relaxed">
              Customize the platform appearance and branding. Changes made here will reflect globally across all journal portals and administrative interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100">
              <h4 className="text-xs font-black uppercase tracking-widest text-brand-navy mb-6">Website Branding</h4>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Website Name</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                    value={settings.siteName}
                    onChange={(e) => updateSiteName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Footer Legal/Notice</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                    value={settings.siteFooterInfo}
                    onChange={(e) => updateFooterInfo(e.target.value)}
                    placeholder="e.g. Registered in England & Wales"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Copyright Year</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                    value={settings.copyrightYear}
                    onChange={(e) => updateCopyrightYear(e.target.value)}
                    placeholder="e.g. 2026"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Portal Logo (Global)</label>
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-white border border-gray-100 rounded-sm flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-4 text-brand-navy">
                      {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-gray-200">
                          <Settings size={40} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow space-y-3">
                      <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => updateLogo(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <button 
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="w-full py-3 bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all"
                      >
                        Upload New Logo
                      </button>
                      <button 
                        onClick={() => updateLogo(null)}
                        className="w-full py-3 border border-gray-200 text-brand-navy/40 text-[9px] font-black uppercase tracking-widest rounded-sm hover:border-brand-navy hover:text-brand-navy transition-all"
                      >
                        Reset Logo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Browser Favicon (.ico/png)</label>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white border border-gray-100 rounded-sm flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-2">
                      {settings.faviconUrl ? (
                        <img src={settings.faviconUrl} alt="Favicon Preview" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-grow space-y-2">
                       <input 
                        type="file" 
                        id="favicon-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => updateFavicon(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => document.getElementById('favicon-upload')?.click()}
                          className="flex-1 py-3 bg-gray-100 text-brand-navy text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-gray-200 transition-all"
                        >
                          Upload Favicon
                        </button>
                        <button 
                          onClick={() => updateFavicon(null)}
                          className="px-4 py-3 border border-gray-200 text-brand-navy/40 text-[9px] font-black uppercase tracking-widest rounded-sm hover:border-brand-navy hover:text-brand-navy transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => {
                      // Already auto-saved to localStorage, but we can show a notification
                      showNotification('Branding changes applied successfully!', 'success');
                    }}
                    className="w-full py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all shadow-xl"
                  >
                    Apply Global Branding Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100">
              <h4 className="text-xs font-black uppercase tracking-widest text-brand-navy mb-6">Website Page Management</h4>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Select Page</label>
                    <select 
                      value={selectedPageId}
                      onChange={(e) => setSelectedPageId(e.target.value)}
                      className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                    >
                      {Object.keys(settings.pages).map(id => (
                        <option key={id} value={id}>{settings.pages[id].title}</option>
                      ) )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Page Header</label>
                    <input 
                      type="text" 
                      className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                      value={tempPageTitle}
                      onChange={(e) => setTempPageTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Page Body Content</label>
                  <textarea 
                    rows={4}
                    className="w-full border border-gray-200 rounded-sm p-3 outline-none focus:border-brand-action transition-colors text-sm leading-relaxed"
                    value={tempPageContent}
                    onChange={(e) => setTempPageContent(e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleSavePage}
                  className="w-full py-4 bg-brand-action text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-navy transition-all shadow-lg shadow-brand-action/20"
                >
                  Update Static Page Content
                </button>
              </div>
            </div>

            <div className="bg-brand-navy text-white p-10 rounded-sm shadow-2xl relative overflow-hidden md:col-span-2 mt-8">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={120} />
              </div>
              <div className="relative z-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-brand-action mb-6">Security & Infrastructure</h4>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">SSL Certificate</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Active</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">Maintenance Mode</span>
                    <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer group">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 transition-all"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">Search Engine Indexing</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Allowed</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">CORS Policy</span>
                    <span className="text-[10px] font-mono text-white/40 italic">Strict-Origin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Icons & Profile Links Manager Section */}
      <section id="social-config-section" className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-12">
            <div className="flex items-center gap-3 text-brand-action mb-4">
              <Share2 size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Social Media Management</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Social Icons & Profile Links</h2>
            <p className="text-brand-navy/60 text-sm leading-relaxed">
              Configure and update official social media URLs (LinkedIn, Twitter / X, YouTube, Facebook, Instagram) linked across the site footer and header icons.
            </p>
          </div>

          <form onSubmit={handleSaveSocialLinks} className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              
              {/* LinkedIn */}
              <div className="p-5 border border-gray-100 rounded-sm hover:border-blue-300 transition-colors bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-md">
                      <Linkedin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">LinkedIn Company Page</h4>
                      <p className="text-[10px] text-slate-400">Official institutional network page</p>
                    </div>
                  </div>
                  {socialLinkedin && (
                    <a
                      href={socialLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Test <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/company/your-organization"
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-gray-200 rounded-sm p-3 outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              {/* Twitter / X */}
              <div className="p-5 border border-gray-100 rounded-sm hover:border-sky-300 transition-colors bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 text-white rounded-md">
                      <Twitter size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">Twitter / X Handle</h4>
                      <p className="text-[10px] text-slate-400">Official news and updates handle</p>
                    </div>
                  </div>
                  {socialTwitter && (
                    <a
                      href={socialTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-sky-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Test <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://twitter.com/your-handle"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-gray-200 rounded-sm p-3 outline-none focus:border-slate-800 transition-colors"
                />
              </div>

              {/* YouTube */}
              <div className="p-5 border border-gray-100 rounded-sm hover:border-rose-300 transition-colors bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600 text-white rounded-md">
                      <Youtube size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">YouTube Channel</h4>
                      <p className="text-[10px] text-slate-400">Video lectures and conference webinars</p>
                    </div>
                  </div>
                  {socialYoutube && (
                    <a
                      href={socialYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-red-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Test <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/@your-channel"
                  value={socialYoutube}
                  onChange={(e) => setSocialYoutube(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-gray-200 rounded-sm p-3 outline-none focus:border-red-600 transition-colors"
                />
              </div>

              {/* Facebook */}
              <div className="p-5 border border-gray-100 rounded-sm hover:border-blue-300 transition-colors bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-700 text-white rounded-md">
                      <Facebook size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">Facebook Page</h4>
                      <p className="text-[10px] text-slate-400">Community and public announcements</p>
                    </div>
                  </div>
                  {socialFacebook && (
                    <a
                      href={socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-700 font-bold hover:underline flex items-center gap-1"
                    >
                      Test <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://www.facebook.com/your-page"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-gray-200 rounded-sm p-3 outline-none focus:border-blue-700 transition-colors"
                />
              </div>

              {/* Instagram */}
              <div className="p-5 border border-gray-100 rounded-sm hover:border-pink-300 transition-colors bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-md">
                      <Instagram size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">Instagram Account</h4>
                      <p className="text-[10px] text-slate-400">Visual highlights and editorial stories</p>
                    </div>
                  </div>
                  {socialInstagram && (
                    <a
                      href={socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-pink-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Test <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/your-profile"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-gray-200 rounded-sm p-3 outline-none focus:border-pink-500 transition-colors"
                />
              </div>

            </div>

            {/* Live Preview Panel & Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Active Footer Icons Preview:</span>
                <div className="flex items-center gap-2 bg-brand-navy p-2 rounded-full px-4">
                  {socialLinkedin && <Linkedin size={14} className="text-white" />}
                  {socialTwitter && <Twitter size={14} className="text-white" />}
                  {socialYoutube && <Youtube size={14} className="text-white" />}
                  {socialFacebook && <Facebook size={14} className="text-white" />}
                  {socialInstagram && <Instagram size={14} className="text-white" />}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSocialLinkedin(DEFAULT_SOCIAL_LINKS.linkedinUrl);
                    setSocialTwitter(DEFAULT_SOCIAL_LINKS.twitterUrl);
                    setSocialYoutube(DEFAULT_SOCIAL_LINKS.youtubeUrl);
                    setSocialFacebook(DEFAULT_SOCIAL_LINKS.facebookUrl);
                    setSocialInstagram(DEFAULT_SOCIAL_LINKS.instagramUrl);
                    showNotification('Social media URLs reset to default values', 'info');
                  }}
                  className="px-5 py-3 border border-gray-200 text-brand-navy/60 text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-brand-navy hover:text-brand-navy transition-all"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  className="flex-1 md:flex-none px-8 py-3.5 bg-brand-action text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-navy transition-all shadow-lg shadow-brand-action/20 flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Save Social Media Links
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Us Page Management Section */}
      <section id="contact-config-section" className="py-24 bg-gray-50/60 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-teal-600 mb-4">
                <Mail size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Public Page Governance</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Contact Us Page Editor</h2>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                Manage all text content, global office locations, journal permissions contact email, and SLA response times displayed on the public Contact Us page.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/contact" 
                target="_blank" 
                className="flex items-center gap-2 px-5 py-3 border border-gray-300 bg-white text-brand-navy text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-brand-navy transition-all shadow-sm"
              >
                <ExternalLink size={14} /> View Public Page
              </Link>
              <button 
                onClick={() => handleOpenOfficeModal()}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
              >
                <Plus size={16} /> Add Office Location
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form for Main Page Content */}
            <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-sm border border-gray-100 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-brand-navy mb-8 pb-4 border-b border-gray-100 flex items-center justify-between">
                <span>General Page Content & Contact Emails</span>
                <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded">Live Configuration</span>
              </h3>

              <form onSubmit={handleSaveContactConfig} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50">Hero Section Title</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:bg-white focus:border-teal-600 transition-all text-sm font-bold"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50">Journal Permissions Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:bg-white focus:border-teal-600 transition-all text-sm font-bold"
                      value={contactPermissionsEmail}
                      onChange={(e) => setContactPermissionsEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50">Hero Tagline / Introduction</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:bg-white focus:border-teal-600 transition-all text-sm leading-relaxed resize-none"
                    value={contactSubtitle}
                    onChange={(e) => setContactSubtitle(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-navy mb-4">Response Time SLAs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Email Inquiries SLA</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-teal-600"
                        value={contactResponseEmail}
                        onChange={(e) => setContactResponseEmail(e.target.value)}
                        placeholder="e.g. 24-48 Hours"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Editing Quotes SLA</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-teal-600"
                        value={contactResponseQuotes}
                        onChange={(e) => setContactResponseQuotes(e.target.value)}
                        placeholder="e.g. Within 12 Hours"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Tech Support SLA</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-teal-600"
                        value={contactResponseTech}
                        onChange={(e) => setContactResponseTech(e.target.value)}
                        placeholder="e.g. Same Day"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Footer Callout Title</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-teal-600"
                      value={contactFaqTitle}
                      onChange={(e) => setContactFaqTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Footer Callout Subtitle</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-teal-600"
                      value={contactFaqSubtitle}
                      onChange={(e) => setContactFaqSubtitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20"
                  >
                    Save Contact Page Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Offices List */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-navy">Global Offices ({contactConfig.offices?.length || 0})</h3>
                    <p className="text-[10px] text-brand-navy/40 mt-0.5">Physical locations displayed on Contact page</p>
                  </div>
                  <button 
                    onClick={() => handleOpenOfficeModal()}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-sm transition-colors"
                    title="Add Location"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {(contactConfig.offices || []).map((office, idx) => (
                    <div key={office.id || idx} className="p-4 bg-gray-50 border border-gray-100 rounded-sm hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 block">{office.type}</span>
                          <h4 className="font-bold text-brand-navy text-base">{office.city}</h4>
                        </div>
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenOfficeModal(office)}
                            className="p-1.5 text-brand-navy/40 hover:text-teal-600 transition-colors"
                            title="Edit Office"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteOffice(office.id, office.city)}
                            className="p-1.5 text-brand-navy/40 hover:text-red-600 transition-colors"
                            title="Delete Office"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-brand-navy/60 leading-tight">
                        <p className="flex gap-2">
                          <MapPin size={14} className="text-brand-navy/30 shrink-0 mt-0.5" />
                          <span>{office.address}</span>
                        </p>
                        <p className="flex gap-2">
                          <Phone size={14} className="text-brand-navy/30 shrink-0 mt-0.5" />
                          <span>{office.phone}</span>
                        </p>
                      </div>
                    </div>
                  ))}

                  {(!contactConfig.offices || contactConfig.offices.length === 0) && (
                    <div className="text-center py-8 text-xs text-brand-navy/40 italic">
                      No office locations configured yet. Click "Add Office Location" above.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Editors Section */}
      <section id="editors-section" className="py-24 bg-gray-50/30 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-indigo-600 mb-4">
                <Users size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Editorial Board Management</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Active Editors</h2>
              <p className="text-brand-navy/60 text-sm leading-relaxed">
                Management of editorial board members across all journals. Add new members, update affiliations, or assign roles to maintain a balanced and authoritative academic leadership.
              </p>
            </div>
            <button 
              onClick={() => handleOpenEditorModal()}
              className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <Plus size={16} />
              Add New Editor
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Editor</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Role & Affiliation</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Journal</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-navy/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {editors.map((editor) => {
                    const journal = journals.find(j => j.id === editor.journalId);
                    return (
                      <tr key={editor.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center">
                              {editor.photoUrl ? (
                                <img src={editor.photoUrl} alt={editor.name} className="w-full h-full object-cover" />
                              ) : (
                                <User size={20} className="text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-brand-navy text-sm">{editor.name}</div>
                              <div className="text-[10px] text-brand-navy/40">{editor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-tighter rounded mb-1">
                            {editor.role}
                          </div>
                          <div className="text-xs text-brand-navy/60 max-w-xs truncate">{editor.affiliation}</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-xs font-bold text-brand-navy truncate max-w-[150px]">
                            {journal?.title || 'Unknown Journal'}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenEditorModal(editor)}
                              className="p-2 text-brand-navy/20 hover:text-brand-action hover:bg-brand-action/5 rounded transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteEditor(editor.id)}
                              className="p-2 text-brand-navy/20 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {editors.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-brand-navy/40 text-sm italic">
                        No editors registered in the system.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <h2 className="text-3xl font-serif font-bold text-brand-navy">Data-Driven Decision Making</h2>
              <p className="text-brand-navy/70 leading-relaxed text-lg">
                Our administrative suite provides a unified view of the platform's health, combining high-level metrics with granular data analysis to support strategic growth and operational excellence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 bg-white border border-gray-100 rounded-sm shadow-sm">
                  <div className="text-brand-action mb-3"><Activity size={24} /></div>
                  <h4 className="font-bold text-brand-navy mb-1 text-sm">Real-time Pulse</h4>
                  <p className="text-xs text-brand-navy/50">Monitor active users and live submissions as they happen.</p>
                </div>
                <div className="p-5 bg-white border border-gray-100 rounded-sm shadow-sm">
                  <div className="text-indigo-600 mb-3"><PieChart size={24} /></div>
                  <h4 className="font-bold text-brand-navy mb-1 text-sm">Portfolio Health</h4>
                  <p className="text-xs text-brand-navy/50">Analyze journal performance across different subject areas.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-brand-navy rounded-sm shadow-2xl overflow-hidden border border-white/10">
                <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={16} className="text-brand-action" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Global Admin Console</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-sm border border-white/5">
                      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Submissions</div>
                      <div className="text-xl font-light text-white">1,284</div>
                      <div className="text-[8px] text-emerald-400 font-bold mt-1">+12% vs LW</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-sm border border-white/5">
                      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Avg. Review</div>
                      <div className="text-xl font-light text-white">24.2d</div>
                      <div className="text-[8px] text-emerald-400 font-bold mt-1">-1.5d vs LW</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-sm border border-white/5">
                      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Active Users</div>
                      <div className="text-xl font-light text-white">4.8k</div>
                      <div className="text-[8px] text-brand-action font-bold mt-1">Live Now</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-white/5 rounded-full w-full overflow-hidden">
                      <div className="w-3/4 h-full bg-brand-action"></div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full w-full overflow-hidden">
                      <div className="w-1/2 h-full bg-indigo-500"></div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full w-full overflow-hidden">
                      <div className="w-2/3 h-full bg-emerald-500"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl rounded-sm border border-gray-100">
                <div className="text-3xl font-bold text-brand-navy">99.9%</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-brand-navy/40">Uptime Reliability</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {ADMIN_FEATURES.map((feature) => (
              <div 
                key={feature.id} 
                onClick={() => {
                  if ('link' in feature && feature.link) {
                    navigate(feature.link as string);
                  } else {
                    const el = document.getElementById(`${feature.id}-section`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="p-10 border border-gray-100 rounded-sm hover:border-brand-action hover:shadow-xl transition-all group bg-white cursor-pointer"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">{feature.title}</h3>
                <p className="text-brand-navy/60 mb-8 leading-relaxed text-sm">
                  {feature.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-brand-action flex-shrink-0" />
                      <span className="text-xs text-brand-navy/80 font-medium">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100 text-xs font-bold text-brand-action group-hover:text-blue-700">
                  <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-[11px]">
                    {'link' in feature && feature.link ? 'Open Dedicated Console' : 'View Section'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Automation Section */}
      <section className="py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Automated Editorial Workflows</h2>
            <p className="text-white/60 leading-relaxed">
              Our platform automates the routine tasks of editorial management, allowing editors to focus on the intellectual quality of the research.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 rounded-sm border border-white/10 text-center">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={24} />
              </div>
              <h4 className="font-bold mb-3">Smart Reminders</h4>
              <p className="text-xs text-white/40 leading-relaxed">Automated notifications for reviewers and authors to keep the process moving.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-sm border border-white/10 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold mb-3">Integrity Checks</h4>
              <p className="text-xs text-white/40 leading-relaxed">Automated plagiarism and ethical compliance screening upon submission.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-sm border border-white/10 text-center">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={24} />
              </div>
              <h4 className="font-bold mb-3">Conflict Detection</h4>
              <p className="text-xs text-white/40 leading-relaxed">AI-powered detection of potential conflicts of interest between authors and reviewers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-sm p-12 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2">Request Admin Access</h3>
              <p className="text-brand-navy/60 text-sm mb-4">Are you a journal editor or institutional administrator? Get in touch for a demo of our dashboard suite.</p>
              <Link to="/security-compliance" className="text-xs font-bold text-brand-action hover:underline flex items-center gap-2">
                🔹 Learn about our Security & Compliance standards <ArrowRight size={14} />
              </Link>
            </div>
            <Link to="/contact" className="px-8 py-4 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all flex items-center gap-2 whitespace-nowrap">
              Contact Sales <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Journal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between shrink-0">
              <h3 className="text-xl font-serif font-bold">{editingJournal ? 'Edit Journal' : 'Add New Journal'}</h3>
              <button onClick={handleCancelJournalEdit} className="text-white/60 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="flex-grow flex flex-col overflow-hidden">
              <div className="p-8 space-y-6 overflow-y-auto flex-grow">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Journal Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">ISSN</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm font-mono"
                      value={issn}
                      onChange={e => setIssn(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">E-ISSN</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm font-mono"
                      value={eissn}
                      onChange={e => setEissn(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input 
                      type="checkbox" 
                      className="rounded text-brand-action focus:ring-brand-action h-4 w-4"
                      id="scopusIndexed"
                      checked={scopusIndexed}
                      onChange={e => setScopusIndexed(e.target.checked)}
                    />
                    <label htmlFor="scopusIndexed" className="text-xs font-semibold text-brand-navy cursor-pointer">Scopus Indexed</label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Indexing & Abstracting (Comma Separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Scopus, Web of Science, DOAJ, Google Scholar"
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    value={indexingStr}
                    onChange={e => setIndexingStr(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Description</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full border border-gray-200 p-3 outline-none focus:border-brand-action transition-colors text-sm rounded-sm"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Category</label>
                    <select 
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm bg-transparent"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option>Science & Technology</option>
                      <option>Engineering</option>
                      <option>Medicine & Healthcare</option>
                      <option>Humanities & Social Sciences</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Subject</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Cover Image / Logo</label>
                  <div className="flex items-center gap-4 py-2">
                    <div className="w-14 h-18 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200 flex items-center justify-center">
                      {coverImage ? (
                        <img src={coverImage} className="w-full h-full object-cover" alt="Logo Preview" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1 p-1 text-center">
                          <Image size={18} />
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          id="journal-cover-upload"
                          onChange={(e) => handleFileUpload(e, 'journal')}
                        />
                        <label 
                          htmlFor="journal-cover-upload"
                          className="btn-pill px-4 py-2 bg-brand-navy text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-brand-action transition-all flex items-center gap-2"
                        >
                          <Upload size={12} /> Upload Image
                        </label>
                      </div>
                      {coverImage ? (
                        <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} /> Logo uploaded
                        </p>
                      ) : (
                        <p className="text-[11px] text-brand-navy/40 italic">Select a logo or cover image file to upload.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end items-center gap-4 shrink-0 bg-gray-50/50">
                <button 
                  type="button" 
                  onClick={handleCancelJournalEdit} 
                  className="px-6 py-2.5 border border-gray-200 text-brand-navy/60 hover:text-brand-navy font-bold uppercase tracking-widest text-[11px] rounded transition-all bg-white hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <X size={14} /> Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-2.5 bg-brand-action text-white hover:bg-brand-navy font-bold uppercase tracking-widest text-[11px] rounded transition-all shadow-lg shadow-brand-action/10 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold">{editingIssue ? 'Edit Issue' : 'Create New Issue'}</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-white/60 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveIssue} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Volume</label>
                  <input 
                    required
                    type="number" 
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    value={issueVolume}
                    onChange={e => setIssueVolume(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Number / Issue</label>
                  <input 
                    required
                    type="number" 
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    value={issueNumber}
                    onChange={e => setIssueNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Year</label>
                  <input 
                    required
                    type="number" 
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    value={issueYear}
                    onChange={e => setIssueYear(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Month (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    value={issueMonth}
                    onChange={e => setIssueMonth(e.target.value)}
                    placeholder="e.g. June"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Issue Cover Image</label>
                <div className="flex items-center gap-4 py-2">
                  <div className="w-12 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                    {issueCover ? (
                      <img src={issueCover} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Image size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        id="issue-cover-upload"
                        onChange={(e) => handleFileUpload(e, 'issue')}
                      />
                      <label 
                        htmlFor="issue-cover-upload"
                        className="btn-pill px-4 py-2 bg-brand-navy text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-brand-action transition-all flex items-center gap-2"
                      >
                        <Upload size={12} /> Upload Image
                      </label>
                      <span className="text-[10px] text-brand-navy/30 uppercase font-black tracking-widest">or</span>
                    </div>
                    <input 
                      required
                      type="text" 
                      placeholder="Paste Image URL..."
                      className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-brand-action transition-colors text-xs"
                      value={issueCover}
                      onChange={e => setIssueCover(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="issuePublished"
                  checked={issuePublished}
                  onChange={e => setIssuePublished(e.target.checked)}
                  className="w-4 h-4 text-brand-action border-gray-300 rounded focus:ring-brand-action"
                />
                <label htmlFor="issuePublished" className="text-xs font-bold text-brand-navy/70">Published (Visible to public)</label>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowIssueModal(false)} className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 hover:text-brand-navy">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all">
                  {editingIssue ? 'Update Issue' : 'Create Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold">{editingNews ? 'Edit News Story' : 'Create News Story'}</h3>
              <button onClick={() => setShowNewsModal(false)} className="text-white/60 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveNews} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Headline</label>
                <input 
                  required
                  type="text" 
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                  value={newsTitle}
                  onChange={e => setNewsTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Excerpt / Short Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full border border-gray-200 p-3 outline-none focus:border-brand-action transition-colors text-sm rounded-sm"
                  value={newsExcerpt}
                  onChange={e => setNewsExcerpt(e.target.value)}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Category</label>
                  <select 
                    value={newsCategory}
                    onChange={e => setNewsCategory(e.target.value)}
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                  >
                    <option value="Innovation">Innovation</option>
                    <option value="Journals">Journals</option>
                    <option value="Events">Events</option>
                    <option value="Partnerships">Partnerships</option>
                    <option value="Reports">Reports</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Display Date</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    value={newsDate}
                    onChange={e => setNewsDate(e.target.value)}
                    placeholder="e.g. Oct 24, 2025"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Cover Image</label>
                <div className="flex items-center gap-4 py-2">
                  <div className="w-16 h-10 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                    {newsImage ? (
                      <img src={newsImage} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Image size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        id="news-cover-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewsImage(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label 
                        htmlFor="news-cover-upload"
                        className="btn-pill px-4 py-2 bg-brand-navy text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-brand-action transition-all flex items-center gap-2"
                      >
                        <Upload size={12} /> Upload
                      </label>
                    </div>
                    <input 
                      required
                      type="text" 
                      placeholder="Or paste URL..."
                      className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-brand-action transition-colors text-[10px]"
                      value={newsImage}
                      onChange={e => setNewsImage(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="newsFeatured"
                  checked={newsFeatured}
                  onChange={e => setNewsFeatured(e.target.checked)}
                  className="w-4 h-4 text-brand-action border-gray-300 rounded focus:ring-brand-action"
                />
                <label htmlFor="newsFeatured" className="text-xs font-bold text-brand-navy/70">Featured Story (Hero display)</label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowNewsModal(false)} className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 hover:text-brand-navy">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-brand-action text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-navy transition-all">
                  {editingNews ? 'Update Story' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold">{editingArticle ? 'Update Manuscript' : 'Upload New Article'}</h3>
              <button onClick={() => setShowArticleModal(false)} className="text-white/60 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveArticle} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Article Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                  value={articleTitle}
                  onChange={e => setArticleTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Abstract</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full border border-gray-200 p-3 outline-none focus:border-brand-action transition-colors text-sm rounded-sm"
                  value={articleAbstract}
                  onChange={e => setArticleAbstract(e.target.value)}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Target Journal</label>
                  <select 
                    value={articleJournalId}
                    onChange={e => {
                      setArticleJournalId(e.target.value);
                      setArticleIssueId(''); // Reset issue when journal changes
                      setArticleVolume(''); // Reset volume when journal changes
                      setArticleIssue(''); // Reset issue number when journal changes
                    }}
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                  >
                    <option value="" disabled>Select Journal</option>
                    {journals.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Current Status</label>
                  <select 
                    value={articleStatus}
                    onChange={e => setArticleStatus(e.target.value as ArticleStatus)}
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Assign to Issue (Digital)</label>
                  <select 
                    value={articleIssueId}
                    onChange={e => {
                      const id = e.target.value;
                      setArticleIssueId(id);
                      if (id) {
                        const selectedIssue = journalIssues.find(i => i.id === id);
                        if (selectedIssue) {
                          setArticleVolume(selectedIssue.volume.toString());
                          setArticleIssue(selectedIssue.number.toString());
                        }
                      } else {
                        setArticleVolume('');
                        setArticleIssue('');
                      }
                    }}
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                  >
                    <option value="">No issue (Unassigned)</option>
                    {articleJournalId ? (
                       journalIssues.map(i => (
                         <option key={i.id} value={i.id}>Vol. {i.volume}, No. {i.number} ({i.year})</option>
                       ))
                    ) : null}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Volume (Manual)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 12"
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                      value={articleVolume}
                      onChange={e => setArticleVolume(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Issue (Manual)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 4"
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                      value={articleIssue}
                      onChange={e => setArticleIssue(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Keywords (Comma separated)</label>
                <input 
                  type="text" 
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                  value={articleKeywords}
                  onChange={e => setArticleKeywords(e.target.value)}
                  placeholder="e.g. AI, Biotechnology, Ethics"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Article PDF (Required for Publication)</label>
                <input 
                  type="file"
                  ref={pdfInputRef}
                  onChange={handleArticlePdfUpload}
                  className="hidden"
                  accept=".pdf"
                />
                <div 
                  onClick={() => pdfInputRef.current?.click()}
                  className="border border-dashed border-gray-200 rounded-sm p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-action hover:bg-brand-action/5 transition-all group"
                >
                  {uploadedArticlePdf || articlePdfUrl ? (
                    <div className="flex items-center gap-4 text-brand-navy w-full px-2">
                      <div className="w-10 h-10 bg-brand-action/10 rounded flex items-center justify-center shrink-0">
                        <FileText className="text-brand-action" size={20} />
                      </div>
                      <div className="text-left overflow-hidden">
                        <div className="text-sm font-bold truncate">{uploadedArticlePdf ? uploadedArticlePdf.name : (articlePdfUrl.split('/').pop() || 'manuscript.pdf')}</div>
                        <div className="text-[10px] text-brand-navy/40 uppercase font-black tracking-widest">
                          {uploadedArticlePdf ? `${(uploadedArticlePdf.size / 1024 / 1024).toFixed(2)} MB — Added` : 'Existing PDF Linked'}
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedArticlePdf(null);
                          setArticlePdfUrl('');
                        }}
                        className="ml-auto p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={24} className="text-gray-300 mb-2 group-hover:text-brand-action transition-colors mx-auto" />
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Click to upload full-text manuscript (PDF)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowArticleModal(false)} className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 hover:text-brand-navy">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all shadow-lg shadow-brand-navy/10">
                  {editingArticle ? 'Update Manuscript' : 'Upload & Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Editor Modal */}
      {showEditorModal && (
        <div className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center text-white">
              <div>
                <h3 className="text-lg font-serif font-bold italic">{editingEditor ? 'Edit Editorial Board Member' : 'Add New Editorial Member'}</h3>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Database Entry Control</p>
              </div>
              <button onClick={() => setShowEditorModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEditor} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Dr. Helena Costa"
                    className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-indigo-500 transition-colors text-xs font-bold"
                    value={editorName}
                    onChange={e => setEditorName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="h.costa@university.edu"
                    className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-indigo-500 transition-colors text-xs font-bold"
                    value={editorEmail}
                    onChange={e => setEditorEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Institutional Affiliation</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Harvard University, Dept of Economics"
                  className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-indigo-500 transition-colors text-xs font-bold"
                  value={editorAffiliation}
                  onChange={e => setEditorAffiliation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Board Role</label>
                  <select 
                    className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-indigo-500 transition-colors text-xs font-bold bg-transparent"
                    value={editorRole}
                    onChange={e => setEditorRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="Editor-in-Chief">Editor-in-Chief</option>
                    <option value="Associate Editor">Associate Editor</option>
                    <option value="Managing Editor">Managing Editor</option>
                    <option value="Technical Editor">Technical Editor</option>
                    <option value="Editorial Assistant">Editorial Assistant</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Assign to Journal</label>
                  <select 
                    className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-indigo-500 transition-colors text-xs font-bold bg-transparent"
                    value={editorJournalId}
                    onChange={e => setEditorJournalId(e.target.value)}
                  >
                    {journals.map(journal => (
                      <option key={journal.id} value={journal.id}>{journal.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Profile Photo URL (Optional)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-indigo-500 transition-colors text-xs font-bold"
                  value={editorPhotoUrl}
                  onChange={e => setEditorPhotoUrl(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowEditorModal(false)} className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 hover:text-brand-navy">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10">
                  {editingEditor ? 'Update Profile' : 'Assign Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Office Location Modal */}
      {showOfficeModal && (
        <div className="fixed inset-0 z-[150] bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-sm shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="bg-teal-700 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building size={20} />
                <div>
                  <h3 className="font-bold text-lg leading-tight">{editingOffice ? 'Edit Office Location' : 'Add New Office Location'}</h3>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest font-mono">Contact Us Page Directory</p>
                </div>
              </div>
              <button onClick={() => setShowOfficeModal(false)} className="text-white/60 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveOffice} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">City / Location</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Frankfurt"
                    className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-teal-600 transition-colors text-xs font-bold"
                    value={officeCity}
                    onChange={e => setOfficeCity(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Office Role / Type</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. European Operations Hub"
                    className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-teal-600 transition-colors text-xs font-bold"
                    value={officeType}
                    onChange={e => setOfficeType(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Full Street Address</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="e.g. Mainzer Landstraße 180, 60327 Frankfurt am Main, Germany"
                  className="w-full border border-gray-200 p-2 rounded-sm outline-none focus:border-teal-600 transition-colors text-xs resize-none"
                  value={officeAddress}
                  onChange={e => setOfficeAddress(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Phone Number</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. +49 69 1234 5678"
                  className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-teal-600 transition-colors text-xs font-bold"
                  value={officePhone}
                  onChange={e => setOfficePhone(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowOfficeModal(false)} className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 hover:text-brand-navy">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-teal-600 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                  {editingOffice ? 'Save Changes' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Request Admin Access Modal */}
      <RequestAdminAccessModal 
        isOpen={showRequestAccessModal} 
        onClose={() => setShowRequestAccessModal(false)} 
      />
    </div>
  );
};
