export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'reviewer' | 'author';
  department?: string;
  institution?: string;
  bio?: string;
  passwordHash?: string;
  createdAt?: string;
}

export interface Journal {
  id: string;
  title: string;
  code: string;
  description: string;
  eissn: string;
  impactFactor: string;
  citeScore: string;
  speedDays: string;
  acceptanceRate: string;
  indexing: string[];
  logoUrl: string;
  coverImage: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Issue {
  id: string;
  journalId: string;
  volume: number;
  number: number;
  year: number;
  title: string;
  coverImage: string;
  published: boolean;
  publishedDate?: string;
  createdAt?: string;
}

export interface ArticleAuthor {
  name: string;
  email?: string;
  affiliation?: string;
  orcid?: string;
}

export interface Article {
  id: string;
  journalId: string;
  issueId: string;
  title: string;
  abstract: string;
  authors: ArticleAuthor[];
  status: 'PENDING' | 'UNDER_REVIEW' | 'REJECTED' | 'ACCEPTED' | 'PUBLISHED';
  doi: string;
  pages: string;
  pdfUrl?: string;
  viewCount: number;
  downloadCount: number;
  citationsCount: number;
  keywords: string[];
  fullText?: string;
  publishedAt?: string;
  createdAt?: string;
}

export interface Manuscript {
  id: string;
  title: string;
  abstract: string;
  journalId: string;
  authorId: string;
  authorEmail: string;
  authorName?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISED' | 'ACCEPTED' | 'PUBLISHED' | 'REJECTED';
  submittedAt: string;
  fileUrl?: string;
  pdfUrl?: string;
  reviewerIds?: string[];
  comments?: any[];
  createdAt?: string;
}

export interface Editor {
  id: string;
  journalId: string;
  name: string;
  email: string;
  affiliation: string;
  role: string;
  photoUrl: string;
  createdAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  featured?: boolean;
  content?: string;
  createdAt?: string;
}

export interface SiteSettings {
  key: string;
  value: any;
  updatedAt?: string;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  inquiryType?: string;
  orcid?: string;
  message: string;
  createdAt?: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  affiliation?: string;
  orcid?: string;
  createdAt?: string;
}

export interface Reviewer {
  id: string;
  name: string;
  email: string;
  expertise?: string[];
  affiliation?: string;
  assignedManuscripts?: string[];
  createdAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  important?: boolean;
  createdAt?: string;
}

export interface EditorialBoardMember {
  id: string;
  journalId: string;
  name: string;
  email: string;
  affiliation: string;
  role: string;
  photoUrl?: string;
  createdAt?: string;
}
