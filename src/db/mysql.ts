import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// MySQL Configuration from Environment Variables
export const DB_HOST = process.env.DB_HOST || '';
export const DB_PORT = Number(process.env.DB_PORT) || 3306;
export const DB_NAME = process.env.DB_NAME || 'academic_journal_db';
export const DB_USER = process.env.DB_USER || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';

let pool: Pool | null = null;
let isInitialized = false;
let connectionError: string | null = null;

// Local In-Memory Fallback Cache for local preview/development when remote MySQL is offline or not configured
const memoryStore: Record<string, Map<string, any>> = {};

function getMemoryCollection(name: string): Map<string, any> {
  if (!memoryStore[name]) {
    memoryStore[name] = new Map<string, any>();
  }
  return memoryStore[name];
}

/**
 * Initialize MySQL Connection Pool
 */
export function getMySQLPool(): Pool | null {
  if (pool) return pool;

  if (!DB_HOST || !DB_USER) {
    console.log('[MySQL] No DB_HOST or DB_USER specified in environment. Running in local adapter mode.');
    return null;
  }

  try {
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 5,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      charset: 'utf8mb4'
    });

    console.log(`[MySQL Pool] Created connection pool for ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    return pool;
  } catch (err: any) {
    connectionError = err.message || String(err);
    console.error('[MySQL Pool Error] Failed to initialize connection pool:', connectionError);
    return null;
  }
}

/**
 * Health Check: Verifies MySQL Connectivity via Ping
 */
export async function testMySQLConnection(): Promise<{
  connected: boolean;
  message: string;
  host?: string;
  database?: string;
  latencyMs?: number;
}> {
  const currentPool = getMySQLPool();
  if (!currentPool) {
    return {
      connected: false,
      message: connectionError || 'MySQL pool not initialized (Missing DB_HOST/DB_USER environment variables)',
      host: DB_HOST || 'localhost (unconfigured)',
      database: DB_NAME
    };
  }

  const start = Date.now();
  let conn: PoolConnection | null = null;
  try {
    conn = await currentPool.getConnection();
    await conn.query('SELECT 1 AS healthy');
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      message: 'MySQL database connected and healthy',
      host: DB_HOST,
      database: DB_NAME,
      latencyMs
    };
  } catch (err: any) {
    connectionError = err.message || String(err);
    return {
      connected: false,
      message: `MySQL connection failed: ${err.message}`,
      host: DB_HOST,
      database: DB_NAME
    };
  } finally {
    if (conn) conn.release();
  }
}

/**
 * Initialize Tables, Foreign Keys, Indexes, and Constraints
 */
export async function initMySQLSchema(): Promise<void> {
  if (isInitialized) return;
  const currentPool = getMySQLPool();

  if (!currentPool) {
    seedMemoryStoreIfEmpty();
    isInitialized = true;
    return;
  }

  let conn: PoolConnection | null = null;
  try {
    conn = await currentPool.getConnection();
    console.log('[MySQL Migration] Verifying and creating relational database tables...');

    // 1. Journals Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS journals (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(512) NOT NULL,
        code VARCHAR(64) UNIQUE,
        description TEXT,
        category VARCHAR(128),
        subject VARCHAR(256),
        access VARCHAR(64) DEFAULT 'Open Access',
        issn VARCHAR(64),
        eissn VARCHAR(64),
        impact_factor VARCHAR(32),
        cite_score VARCHAR(32),
        speed_days VARCHAR(32),
        acceptance_rate VARCHAR(32),
        indexing JSON,
        logo_url TEXT,
        cover_image TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_journals_category (category),
        INDEX idx_journals_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Issues Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id VARCHAR(128) PRIMARY KEY,
        journal_id VARCHAR(128) NOT NULL,
        volume INT DEFAULT 1,
        number INT DEFAULT 1,
        year INT DEFAULT 2024,
        title VARCHAR(512),
        description TEXT,
        published BOOLEAN DEFAULT TRUE,
        cover_image TEXT,
        published_date VARCHAR(128),
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_issues_journal_id (journal_id),
        INDEX idx_issues_year_vol (year, volume, number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Articles Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(128) PRIMARY KEY,
        journal_id VARCHAR(128) NOT NULL,
        issue_id VARCHAR(128),
        title VARCHAR(1024) NOT NULL,
        abstract LONGTEXT,
        authors JSON,
        status VARCHAR(64) DEFAULT 'PUBLISHED',
        doi VARCHAR(256),
        pages VARCHAR(128),
        pdf_url TEXT,
        view_count INT DEFAULT 0,
        download_count INT DEFAULT 0,
        citations_count INT DEFAULT 0,
        keywords JSON,
        full_text LONGTEXT,
        published_at VARCHAR(128),
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_articles_journal (journal_id),
        INDEX idx_articles_issue (issue_id),
        INDEX idx_articles_status (status),
        INDEX idx_articles_doi (doi)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. News & Announcements Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS news (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(512) NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        date VARCHAR(128),
        category VARCHAR(128),
        image TEXT,
        featured BOOLEAN DEFAULT FALSE,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_news_category (category),
        INDEX idx_news_featured (featured)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Settings Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key_name VARCHAR(128) PRIMARY KEY,
        setting_value JSON,
        updated_at VARCHAR(128)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Users Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(256) UNIQUE NOT NULL,
        name VARCHAR(256),
        role VARCHAR(64) DEFAULT 'reader',
        department VARCHAR(256),
        institution VARCHAR(256),
        password_hash VARCHAR(256),
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_users_email (email),
        INDEX idx_users_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Submissions & Manuscripts Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(1024) NOT NULL,
        abstract LONGTEXT,
        journal_id VARCHAR(128),
        author_id VARCHAR(128),
        author_name VARCHAR(256),
        author_email VARCHAR(256),
        status VARCHAR(64) DEFAULT 'SUBMITTED',
        file_url TEXT,
        submitted_at VARCHAR(128),
        reviewers JSON,
        comments JSON,
        metadata JSON,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_submissions_journal (journal_id),
        INDEX idx_submissions_author (author_id),
        INDEX idx_submissions_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. Reviews Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(128) PRIMARY KEY,
        submission_id VARCHAR(128) NOT NULL,
        reviewer_id VARCHAR(128),
        reviewer_name VARCHAR(256),
        reviewer_email VARCHAR(256),
        recommendation VARCHAR(64),
        comments_for_author LONGTEXT,
        confidential_comments LONGTEXT,
        score INT DEFAULT 0,
        status VARCHAR(64) DEFAULT 'PENDING',
        submitted_at VARCHAR(128),
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_reviews_submission (submission_id),
        INDEX idx_reviews_reviewer (reviewer_id),
        INDEX idx_reviews_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 9. Metrics & Analytics Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS metrics (
        id VARCHAR(128) PRIMARY KEY,
        visitor_id VARCHAR(128),
        session_id VARCHAR(128),
        action_type VARCHAR(64),
        page_path VARCHAR(512),
        page_title VARCHAR(512),
        details JSON,
        device VARCHAR(64),
        browser VARCHAR(64),
        os VARCHAR(64),
        ip VARCHAR(64),
        country VARCHAR(128),
        region VARCHAR(128),
        referrer TEXT,
        consent_category VARCHAR(64),
        timestamp VARCHAR(128),
        INDEX idx_metrics_action (action_type),
        INDEX idx_metrics_visitor (visitor_id),
        INDEX idx_metrics_session (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 10. CMS Pages Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id VARCHAR(128) PRIMARY KEY,
        slug VARCHAR(256) UNIQUE NOT NULL,
        title VARCHAR(512) NOT NULL,
        content LONGTEXT,
        meta_description TEXT,
        is_published BOOLEAN DEFAULT TRUE,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_pages_slug (slug),
        INDEX idx_pages_is_published (is_published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 11. Editors Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS editors (
        id VARCHAR(128) PRIMARY KEY,
        journal_id VARCHAR(128),
        name VARCHAR(256) NOT NULL,
        email VARCHAR(256),
        affiliation VARCHAR(512),
        role VARCHAR(128),
        photo_url TEXT,
        bio TEXT,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_editors_journal (journal_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 12. Invoices Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(128) PRIMARY KEY,
        invoice_number VARCHAR(128) UNIQUE NOT NULL,
        author_name VARCHAR(256),
        author_email VARCHAR(256),
        journal_id VARCHAR(128),
        article_id VARCHAR(128),
        amount DECIMAL(10,2) DEFAULT 0.00,
        currency VARCHAR(16) DEFAULT 'USD',
        status VARCHAR(64) DEFAULT 'Pending',
        due_date VARCHAR(64),
        paid_date VARCHAR(64),
        reminders_sent_count INT DEFAULT 0,
        last_reminder_sent_at VARCHAR(64),
        metadata JSON,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_invoices_author (author_email),
        INDEX idx_invoices_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 13. Subscribers Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(256) UNIQUE NOT NULL,
        name VARCHAR(256),
        journals JSON,
        status VARCHAR(64) DEFAULT 'active',
        source VARCHAR(128),
        subscribed_at VARCHAR(128),
        unsubscribed_at VARCHAR(128),
        token VARCHAR(256),
        INDEX idx_subscribers_email (email),
        INDEX idx_subscribers_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 14. Live Chats Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS live_chats (
        id VARCHAR(128) PRIMARY KEY,
        visitor_name VARCHAR(256),
        visitor_email VARCHAR(256),
        status VARCHAR(64) DEFAULT 'open',
        assigned_to VARCHAR(256),
        messages JSON,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        INDEX idx_live_chats_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 15. Generic Collection Store (For any remaining flexible entities like contact inquiries, payment reminders, etc.)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS generic_entities (
        collection_name VARCHAR(128) NOT NULL,
        id VARCHAR(128) NOT NULL,
        data JSON NOT NULL,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        PRIMARY KEY (collection_name, id),
        INDEX idx_generic_collection (collection_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('[MySQL Migration] All MySQL tables and indexes successfully created.');

    // Seed MySQL if empty
    await seedMySQLIfEmpty(conn);

    isInitialized = true;
  } catch (err: any) {
    console.warn('[MySQL Schema Init Notice]:', err?.message || err);
  } finally {
    if (conn) conn.release();
  }
}

/**
 * Automatic MySQL Seeder
 */
async function seedMySQLIfEmpty(conn: PoolConnection) {
  try {
    const [rows]: any = await conn.query('SELECT COUNT(*) AS cnt FROM journals');
    if (rows[0]?.cnt > 0) {
      return; // Database already contains data
    }

    console.log('[MySQL Seeder] Seeding initial baseline datasets into MySQL...');

    // Seed Journals
    const seedJournals = [
      {
        id: 'j1',
        title: 'International Journal of Agricultural Systems and Innovation (IJASI)',
        code: 'IJASI',
        description: 'Leading research in sustainable agricultural practices, precision farming, and innovation in food systems.',
        category: 'Science & Technology',
        subject: 'Agricultural Systems & Precision Farming',
        access: 'Open Access',
        issn: '2456-1878',
        eissn: '2456-1878',
        impact_factor: '4.85',
        cite_score: '6.2',
        speed_days: '21',
        acceptance_rate: '28%',
        indexing: JSON.stringify(['Scopus', 'Web of Science', 'DOAJ', 'Google Scholar', 'PubMed', 'Crossref']),
        logo_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=300',
        cover_image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
        is_active: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'j3',
        title: 'Journal of Biotechnology and Molecular Engineering (JBME)',
        code: 'JBME',
        description: 'Advanced research in genetic engineering, biomaterials, and molecular diagnostics for modern medicine and industry.',
        category: 'Science & Technology',
        subject: 'Biotechnology & Molecular Engineering',
        access: 'Subscription',
        issn: '0264-8725',
        eissn: '0264-8725',
        impact_factor: '5.12',
        cite_score: '7.1',
        speed_days: '18',
        acceptance_rate: '24%',
        indexing: JSON.stringify(['Scopus', 'Web of Science', 'DOAJ', 'Google Scholar']),
        logo_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=300',
        cover_image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
        is_active: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'j9',
        title: 'International Journal of Educational Research, Innovation and Development (IJERID)',
        code: 'IJERID',
        description: 'A global peer-reviewed platform publishing innovative research on pedagogy, educational technologies, and curriculum development.',
        category: 'Social Sciences & Humanities',
        subject: 'Educational Pedagogy & Technology',
        access: 'Open Access',
        issn: '2789-433X',
        eissn: '2789-433X',
        impact_factor: '3.95',
        cite_score: '5.4',
        speed_days: '25',
        acceptance_rate: '32%',
        indexing: JSON.stringify(['Scopus', 'Web of Science', 'DOAJ', 'Google Scholar', 'ERIC', 'Crossref']),
        logo_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=300',
        cover_image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600',
        is_active: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const j of seedJournals) {
      await conn.query(`
        INSERT INTO journals (id, title, code, description, category, subject, access, issn, eissn, impact_factor, cite_score, speed_days, acceptance_rate, indexing, logo_url, cover_image, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title=VALUES(title), updated_at=VALUES(updated_at)
      `, [j.id, j.title, j.code, j.description, j.category, j.subject, j.access, j.issn, j.eissn, j.impact_factor, j.cite_score, j.speed_days, j.acceptance_rate, j.indexing, j.logo_url, j.cover_image, j.is_active, j.created_at, j.updated_at]);
    }

    // Seed Issues
    const seedIssues = [
      { id: 'i1', journal_id: 'j1', volume: 12, number: 1, year: 2024, title: 'Sustainable Food Production Systems', published: 1, cover_image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600', published_date: 'Jan 15, 2024', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'i6', journal_id: 'j9', volume: 1, number: 1, year: 2024, title: 'Innovations in Digital Pedagogy & Global Leadership', published: 1, cover_image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600', published_date: 'Feb 01, 2024', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];

    for (const iss of seedIssues) {
      await conn.query(`
        INSERT INTO issues (id, journal_id, volume, number, year, title, published, cover_image, published_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title=VALUES(title)
      `, [iss.id, iss.journal_id, iss.volume, iss.number, iss.year, iss.title, iss.published, iss.cover_image, iss.published_date, iss.created_at, iss.updated_at]);
    }

    // Seed Articles
    const seedArticles = [
      {
        id: 'a1',
        journal_id: 'j1',
        issue_id: 'i1',
        title: 'Precision Irrigation Management Using IoT Sensor Networks in Arid Agriculture',
        abstract: 'This study investigates the deployment of real-time wireless sensor networks for optimizing drip irrigation efficiency in arid crop production.',
        authors: JSON.stringify([
          { name: 'Dr. Elena Rostova', affiliation: 'Institute of Agricultural Water Management, Vienna, Austria', email: 'e.rostova@iawm.at' },
          { name: 'Prof. Ahmed Al-Mansoor', affiliation: 'Desert Research Centre, Cairo, Egypt', email: 'ahmed@drc.eg' }
        ]),
        status: 'PUBLISHED',
        doi: '10.1016/j.ijasi.2024.01.004',
        pages: '12-28',
        pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        view_count: 1420,
        download_count: 485,
        citations_count: 19,
        keywords: JSON.stringify(['Precision Agriculture', 'IoT Sensors', 'Drip Irrigation', 'Water Conservation', 'Crop Yield']),
        full_text: 'Full text content of precision irrigation research manuscript...',
        published_at: 'Jan 20, 2024',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'a2',
        journal_id: 'j9',
        issue_id: 'i6',
        title: 'Transforming STEM Pedagogy Through Generative AI and Interactive Virtual Labs',
        abstract: 'An empirical investigation into student engagement and conceptual retention when incorporating generative AI tutors alongside interactive virtual science laboratories.',
        authors: JSON.stringify([
          { name: 'Dr. Marcus Thorne', affiliation: 'Stanford Graduate School of Education, USA', email: 'm.thorne@stanford.edu' },
          { name: 'Prof. Elizabeth Vance', affiliation: 'University of Oxford, UK', email: 'e.vance@oxford.edu' }
        ]),
        status: 'PUBLISHED',
        doi: '10.1016/j.ijerid.2024.02.010',
        pages: '45-62',
        pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        view_count: 2890,
        download_count: 912,
        citations_count: 42,
        keywords: JSON.stringify(['Generative AI', 'STEM Pedagogy', 'Virtual Labs', 'Higher Education', 'EdTech']),
        full_text: 'Full text content of EdTech research manuscript...',
        published_at: 'Feb 10, 2024',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const a of seedArticles) {
      await conn.query(`
        INSERT INTO articles (id, journal_id, issue_id, title, abstract, authors, status, doi, pages, pdf_url, view_count, download_count, citations_count, keywords, full_text, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title=VALUES(title)
      `, [a.id, a.journal_id, a.issue_id, a.title, a.abstract, a.authors, a.status, a.doi, a.pages, a.pdf_url, a.view_count, a.download_count, a.citations_count, a.keywords, a.full_text, a.published_at, a.created_at, a.updated_at]);
    }

    // Seed News
    const seedNews = [
      {
        id: 'n1',
        title: 'Academic Publishing Launches AI-Assisted Peer Review Pilot Program',
        excerpt: 'The new initiative aims to reduce review turnaround times by 30% while maintaining the highest standards of academic integrity.',
        date: 'Oct 24, 2025',
        category: 'Innovation',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        featured: 1,
        content: 'Details about the AI-Assisted Peer Review Pilot Program...',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const n of seedNews) {
      await conn.query(`
        INSERT INTO news (id, title, excerpt, content, date, category, image, featured, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title=VALUES(title)
      `, [n.id, n.title, n.excerpt, n.content, n.date, n.category, n.image, n.featured, n.created_at, n.updated_at]);
    }

    // Seed Default Admin User
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await conn.query(`
      INSERT INTO users (id, email, name, role, department, institution, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE role=VALUES(role)
    `, ['u_admin', 'admin@journal.org', 'System Administrator', 'admin', 'Editorial Office', 'Academic Publishing Group', adminPasswordHash, new Date().toISOString(), new Date().toISOString()]);

    // Seed Default CMS Pages
    const seedPages = [
      { id: 'p_about', slug: 'about-us', title: 'About Academic Publishing Group', content: 'Academic Publishing Group is dedicated to advancing global scientific progress...', meta_description: 'Learn about our mission and international editorial board', is_published: 1 },
      { id: 'p_ethics', slug: 'publishing-ethics', title: 'Publication Ethics & Malpractice Statement', content: 'Our journals follow COPE guidelines for ethical academic publishing...', meta_description: 'Publishing ethics, peer review policies, and misconduct prevention', is_published: 1 }
    ];

    for (const p of seedPages) {
      await conn.query(`
        INSERT INTO pages (id, slug, title, content, meta_description, is_published, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title=VALUES(title)
      `, [p.id, p.slug, p.title, p.content, p.meta_description, p.is_published, new Date().toISOString(), new Date().toISOString()]);
    }

    console.log('[MySQL Seeder] Baseline datasets seeded successfully.');
  } catch (err: any) {
    console.warn('[MySQL Seeding Notice]:', err?.message || err);
  }
}

/**
 * Local In-Memory Seeder (For fallback mode)
 */
function seedMemoryStoreIfEmpty() {
  const journals = getMemoryCollection('journals');
  if (journals.size === 0) {
    journals.set('j1', {
      id: 'j1',
      title: 'International Journal of Agricultural Systems and Innovation (IJASI)',
      code: 'IJASI',
      description: 'Leading research in sustainable agricultural practices, precision farming, and innovation in food systems.',
      category: 'Science & Technology',
      subject: 'Agricultural Systems & Precision Farming',
      access: 'Open Access',
      issn: '2456-1878',
      eissn: '2456-1878',
      impactFactor: '4.85',
      citeScore: '6.2',
      speedDays: '21',
      acceptanceRate: '28%',
      indexing: ['Scopus', 'Web of Science', 'DOAJ', 'Google Scholar', 'PubMed', 'Crossref'],
      logoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=300',
      coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
      isActive: true
    });
    journals.set('j9', {
      id: 'j9',
      title: 'International Journal of Educational Research, Innovation and Development (IJERID)',
      code: 'IJERID',
      description: 'A global peer-reviewed platform publishing innovative research on pedagogy and educational technologies.',
      category: 'Social Sciences & Humanities',
      subject: 'Educational Pedagogy & Technology',
      access: 'Open Access',
      issn: '2789-433X',
      eissn: '2789-433X',
      impactFactor: '3.95',
      citeScore: '5.4',
      speedDays: '25',
      acceptanceRate: '32%',
      indexing: ['Scopus', 'Web of Science', 'DOAJ', 'Google Scholar', 'ERIC', 'Crossref'],
      logoUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=300',
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600',
      isActive: true
    });

    const issues = getMemoryCollection('issues');
    issues.set('i1', { id: 'i1', journalId: 'j1', volume: 12, number: 1, year: 2024, title: 'Sustainable Food Production Systems', published: true, coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600', publishedDate: 'Jan 15, 2024' });

    const articles = getMemoryCollection('articles');
    articles.set('a1', {
      id: 'a1',
      journalId: 'j1',
      issueId: 'i1',
      title: 'Precision Irrigation Management Using IoT Sensor Networks in Arid Agriculture',
      abstract: 'This study investigates the deployment of real-time wireless sensor networks for optimizing drip irrigation efficiency in arid crop production.',
      authors: [
        { name: 'Dr. Elena Rostova', affiliation: 'Institute of Agricultural Water Management, Vienna, Austria', email: 'e.rostova@iawm.at' },
        { name: 'Prof. Ahmed Al-Mansoor', affiliation: 'Desert Research Centre, Cairo, Egypt', email: 'ahmed@drc.eg' }
      ],
      status: 'PUBLISHED',
      doi: '10.1016/j.ijasi.2024.01.004',
      pages: '12-28',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      viewCount: 1420,
      downloadCount: 485,
      citationsCount: 19,
      keywords: ['Precision Agriculture', 'IoT Sensors', 'Drip Irrigation', 'Water Conservation', 'Crop Yield'],
      publishedAt: 'Jan 20, 2024'
    });

    const news = getMemoryCollection('news');
    news.set('n1', {
      id: 'n1',
      title: 'Academic Publishing Launches AI-Assisted Peer Review Pilot Program',
      excerpt: 'The new initiative aims to reduce review turnaround times by 30% while maintaining the highest standards of academic integrity.',
      date: 'Oct 24, 2025',
      category: 'Innovation',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      featured: true
    });

    const users = getMemoryCollection('users');
    users.set('u_admin', {
      id: 'u_admin',
      email: 'admin@journal.org',
      name: 'System Administrator',
      role: 'admin',
      department: 'Editorial Office',
      institution: 'Academic Publishing Group',
      passwordHash: '$2a$10$w8.B8y7Rz5b4oR9p1fQ4heF.Eevb9g2U3HqgRkWz9bQk6cR4vL3f6'
    });

    const pages = getMemoryCollection('pages');
    pages.set('about-us', {
      id: 'p_about',
      slug: 'about-us',
      title: 'About Academic Publishing Group',
      content: 'Academic Publishing Group is dedicated to advancing global scientific progress.',
      metaDescription: 'Learn about our mission and international editorial board',
      isPublished: true
    });
  }
}

// Helper to normalize column naming between camelCase (REST/JS) and snake_case (SQL)
function parseJsonField(val: any) {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}

function normalizeSqlRow(row: any): any {
  if (!row) return null;
  const result: any = {};
  for (const [key, val] of Object.entries(row)) {
    // Camelize snake_case keys
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Parse JSON fields automatically
    if (['indexing', 'authors', 'keywords', 'reviewers', 'comments', 'metadata', 'messages', 'details', 'journals', 'settingValue'].includes(camelKey)) {
      result[camelKey] = parseJsonField(val);
    } else if (camelKey === 'isActive' || camelKey === 'published' || camelKey === 'featured' || camelKey === 'isPublished') {
      result[camelKey] = Boolean(val);
    } else {
      result[camelKey] = val;
    }
  }
  return result;
}

/**
 * Universal MySQL Document Adapter (CRUD)
 */
export async function getCollectionDocs(collectionName: string): Promise<any[]> {
  const currentPool = getMySQLPool();
  if (!currentPool) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[Database Service Unavailable 503] Production MySQL connection pool is offline. Refusing fallback.`);
    }
    const mem = getMemoryCollection(collectionName);
    return Array.from(mem.values());
  }

  let conn: PoolConnection | null = null;
  try {
    conn = await currentPool.getConnection();
    
    // Map known collections to specialized tables
    const tableMap: Record<string, string> = {
      journals: 'journals',
      issues: 'issues',
      articles: 'articles',
      news: 'news',
      announcements: 'news',
      users: 'users',
      submissions: 'submissions',
      manuscripts: 'submissions',
      reviews: 'reviews',
      metrics: 'metrics',
      visitor_activities: 'metrics',
      pages: 'pages',
      editors: 'editors',
      editorial_board: 'editors',
      invoices: 'invoices',
      subscribers: 'subscribers',
      live_chats: 'live_chats'
    };

    const tableName = tableMap[collectionName];
    if (tableName) {
      const [rows]: any = await conn.query(`SELECT * FROM ${tableName}`);
      return (rows || []).map(normalizeSqlRow);
    } else if (collectionName === 'settings') {
      const [rows]: any = await conn.query('SELECT * FROM settings');
      return (rows || []).map((r: any) => ({
        id: r.key_name,
        key: r.key_name,
        value: parseJsonField(r.setting_value),
        updatedAt: r.updated_at
      }));
    } else {
      const [rows]: any = await conn.query('SELECT data FROM generic_entities WHERE collection_name = ?', [collectionName]);
      return (rows || []).map((r: any) => parseJsonField(r.data));
    }
  } catch (err: any) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[Database Query Failed 500] Production MySQL query on '${collectionName}' failed: ${err.message}`);
    }
    console.warn(`[MySQL GET ${collectionName} Notice]:`, err?.message || err);
    const mem = getMemoryCollection(collectionName);
    return Array.from(mem.values());
  } finally {
    if (conn) conn.release();
  }
}

export async function getCollectionDocById(collectionName: string, id: string): Promise<any | null> {
  const currentPool = getMySQLPool();
  if (!currentPool) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[Database Service Unavailable 503] Production MySQL connection pool is offline. Refusing fallback.`);
    }
    const mem = getMemoryCollection(collectionName);
    return mem.get(id) || null;
  }

  let conn: PoolConnection | null = null;
  try {
    conn = await currentPool.getConnection();
    
    const tableMap: Record<string, string> = {
      journals: 'journals',
      issues: 'issues',
      articles: 'articles',
      news: 'news',
      announcements: 'news',
      users: 'users',
      submissions: 'submissions',
      manuscripts: 'submissions',
      reviews: 'reviews',
      metrics: 'metrics',
      visitor_activities: 'metrics',
      pages: 'pages',
      editors: 'editors',
      editorial_board: 'editors',
      invoices: 'invoices',
      subscribers: 'subscribers',
      live_chats: 'live_chats'
    };

    const tableName = tableMap[collectionName];
    if (tableName) {
      let [rows]: any = await conn.query(`SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`, [id]);
      if (rows && rows.length > 0) return normalizeSqlRow(rows[0]);

      // If looking up pages by slug
      if (tableName === 'pages') {
        const [slugRows]: any = await conn.query('SELECT * FROM pages WHERE slug = ? LIMIT 1', [id]);
        if (slugRows && slugRows.length > 0) return normalizeSqlRow(slugRows[0]);
      }

      // If looking up journals by code
      if (tableName === 'journals') {
        const [codeRows]: any = await conn.query('SELECT * FROM journals WHERE code = ? LIMIT 1', [id.toUpperCase()]);
        if (codeRows && codeRows.length > 0) return normalizeSqlRow(codeRows[0]);
      }
      return null;
    } else if (collectionName === 'settings') {
      const [rows]: any = await conn.query('SELECT * FROM settings WHERE key_name = ? LIMIT 1', [id]);
      if (rows && rows.length > 0) {
        return {
          id: rows[0].key_name,
          key: rows[0].key_name,
          value: parseJsonField(rows[0].setting_value),
          updatedAt: rows[0].updated_at
        };
      }
      return null;
    } else {
      const [rows]: any = await conn.query('SELECT data FROM generic_entities WHERE collection_name = ? AND id = ? LIMIT 1', [collectionName, id]);
      if (rows && rows.length > 0) return parseJsonField(rows[0].data);
      return null;
    }
  } catch (err: any) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[Database Query Failed 500] Production MySQL query for '${collectionName}/${id}' failed: ${err.message}`);
    }
    console.warn(`[MySQL GET doc ${collectionName}/${id} Notice]:`, err?.message || err);
    const mem = getMemoryCollection(collectionName);
    return mem.get(id) || null;
  } finally {
    if (conn) conn.release();
  }
}

export async function saveCollectionDoc(collectionName: string, id: string, docData: any, isPost = false): Promise<void> {
  const fullData = { ...docData, id };
  const currentPool = getMySQLPool();

  // Always update memory store as fallback
  getMemoryCollection(collectionName).set(id, fullData);

  if (!currentPool) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[Database Service Unavailable 503] Production MySQL connection pool is offline. Cannot save record.`);
    }
    return;
  }

  let conn: PoolConnection | null = null;
  try {
    conn = await currentPool.getConnection();

    if (collectionName === 'journals') {
      const indexing = typeof fullData.indexing === 'string' ? fullData.indexing : JSON.stringify(fullData.indexing || []);
      await conn.query(`
        INSERT INTO journals (id, title, code, description, category, subject, access, issn, eissn, impact_factor, cite_score, speed_days, acceptance_rate, indexing, logo_url, cover_image, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), code=VALUES(code), description=VALUES(description),
          category=VALUES(category), subject=VALUES(subject), access=VALUES(access),
          issn=VALUES(issn), eissn=VALUES(eissn), impact_factor=VALUES(impact_factor),
          cite_score=VALUES(cite_score), speed_days=VALUES(speed_days), acceptance_rate=VALUES(acceptance_rate),
          indexing=VALUES(indexing), logo_url=VALUES(logo_url), cover_image=VALUES(cover_image),
          is_active=VALUES(is_active), updated_at=VALUES(updated_at)
      `, [
        id, fullData.title || '', fullData.code || null, fullData.description || '',
        fullData.category || '', fullData.subject || '', fullData.access || 'Open Access',
        fullData.issn || '', fullData.eissn || '', fullData.impactFactor || '',
        fullData.citeScore || '', fullData.speedDays || '', fullData.acceptanceRate || '',
        indexing, fullData.logoUrl || '', fullData.coverImage || '',
        fullData.isActive !== false ? 1 : 0,
        fullData.createdAt || new Date().toISOString(),
        fullData.updatedAt || new Date().toISOString()
      ]);
    } else if (collectionName === 'issues') {
      await conn.query(`
        INSERT INTO issues (id, journal_id, volume, number, year, title, description, published, cover_image, published_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          journal_id=VALUES(journal_id), volume=VALUES(volume), number=VALUES(number),
          year=VALUES(year), title=VALUES(title), description=VALUES(description),
          published=VALUES(published), cover_image=VALUES(cover_image), published_date=VALUES(published_date),
          updated_at=VALUES(updated_at)
      `, [
        id, fullData.journalId || '', fullData.volume || 1, fullData.number || 1,
        fullData.year || new Date().getFullYear(), fullData.title || '', fullData.description || '',
        fullData.published !== false ? 1 : 0, fullData.coverImage || '', fullData.publishedDate || '',
        fullData.createdAt || new Date().toISOString(), fullData.updatedAt || new Date().toISOString()
      ]);
    } else if (collectionName === 'articles') {
      const authors = typeof fullData.authors === 'string' ? fullData.authors : JSON.stringify(fullData.authors || []);
      const keywords = typeof fullData.keywords === 'string' ? fullData.keywords : JSON.stringify(fullData.keywords || []);
      await conn.query(`
        INSERT INTO articles (id, journal_id, issue_id, title, abstract, authors, status, doi, pages, pdf_url, view_count, download_count, citations_count, keywords, full_text, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          journal_id=VALUES(journal_id), issue_id=VALUES(issue_id), title=VALUES(title),
          abstract=VALUES(abstract), authors=VALUES(authors), status=VALUES(status),
          doi=VALUES(doi), pages=VALUES(pages), pdf_url=VALUES(pdf_url),
          view_count=VALUES(view_count), download_count=VALUES(download_count), citations_count=VALUES(citations_count),
          keywords=VALUES(keywords), full_text=VALUES(full_text), published_at=VALUES(published_at),
          updated_at=VALUES(updated_at)
      `, [
        id, fullData.journalId || '', fullData.issueId || null, fullData.title || '',
        fullData.abstract || '', authors, fullData.status || 'PUBLISHED', fullData.doi || '',
        fullData.pages || '', fullData.pdfUrl || '', fullData.viewCount || 0,
        fullData.downloadCount || 0, fullData.citationsCount || 0, keywords,
        fullData.fullText || '', fullData.publishedAt || '',
        fullData.createdAt || new Date().toISOString(), fullData.updatedAt || new Date().toISOString()
      ]);
    } else if (collectionName === 'news' || collectionName === 'announcements') {
      await conn.query(`
        INSERT INTO news (id, title, excerpt, content, date, category, image, featured, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), excerpt=VALUES(excerpt), content=VALUES(content),
          date=VALUES(date), category=VALUES(category), image=VALUES(image),
          featured=VALUES(featured), updated_at=VALUES(updated_at)
      `, [
        id, fullData.title || '', fullData.excerpt || '', fullData.content || '',
        fullData.date || '', fullData.category || '', fullData.image || '',
        fullData.featured ? 1 : 0, fullData.createdAt || new Date().toISOString(),
        fullData.updatedAt || new Date().toISOString()
      ]);
    } else if (collectionName === 'settings') {
      const settingVal = typeof fullData.value === 'object' ? JSON.stringify(fullData.value) : JSON.stringify(fullData.value !== undefined ? fullData.value : fullData);
      await conn.query(`
        INSERT INTO settings (key_name, setting_value, updated_at)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value), updated_at=VALUES(updated_at)
      `, [id, settingVal, fullData.updatedAt || new Date().toISOString()]);
    } else if (collectionName === 'users') {
      await conn.query(`
        INSERT INTO users (id, email, name, role, department, institution, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          email=VALUES(email), name=VALUES(name), role=VALUES(role),
          department=VALUES(department), institution=VALUES(institution),
          password_hash=COALESCE(VALUES(password_hash), password_hash),
          updated_at=VALUES(updated_at)
      `, [
        id, fullData.email || '', fullData.name || '', fullData.role || 'reader',
        fullData.department || '', fullData.institution || '', fullData.passwordHash || null,
        fullData.createdAt || new Date().toISOString(), fullData.updatedAt || new Date().toISOString()
      ]);
    } else if (collectionName === 'submissions' || collectionName === 'manuscripts') {
      const reviewers = typeof fullData.reviewers === 'string' ? fullData.reviewers : JSON.stringify(fullData.reviewers || []);
      const comments = typeof fullData.comments === 'string' ? fullData.comments : JSON.stringify(fullData.comments || []);
      const metadata = typeof fullData.metadata === 'string' ? fullData.metadata : JSON.stringify(fullData.metadata || {});
      await conn.query(`
        INSERT INTO submissions (id, title, abstract, journal_id, author_id, author_name, author_email, status, file_url, submitted_at, reviewers, comments, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), abstract=VALUES(abstract), journal_id=VALUES(journal_id),
          author_name=VALUES(author_name), author_email=VALUES(author_email), status=VALUES(status),
          file_url=VALUES(file_url), reviewers=VALUES(reviewers), comments=VALUES(comments),
          metadata=VALUES(metadata), updated_at=VALUES(updated_at)
      `, [
        id, fullData.title || '', fullData.abstract || '', fullData.journalId || '',
        fullData.authorId || '', fullData.authorName || '', fullData.authorEmail || '',
        fullData.status || 'SUBMITTED', fullData.fileUrl || '', fullData.submittedAt || '',
        reviewers, comments, metadata,
        fullData.createdAt || new Date().toISOString(), fullData.updatedAt || new Date().toISOString()
      ]);
    } else if (collectionName === 'reviews') {
      await conn.query(`
        INSERT INTO reviews (id, submission_id, reviewer_id, reviewer_name, reviewer_email, recommendation, comments_for_author, confidential_comments, score, status, submitted_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          recommendation=VALUES(recommendation), comments_for_author=VALUES(comments_for_author),
          confidential_comments=VALUES(confidential_comments), score=VALUES(score),
          status=VALUES(status), submitted_at=VALUES(submitted_at), updated_at=VALUES(updated_at)
      `, [
        id, fullData.submissionId || '', fullData.reviewerId || '', fullData.reviewerName || '',
        fullData.reviewerEmail || '', fullData.recommendation || '', fullData.commentsForAuthor || '',
        fullData.confidentialComments || '', fullData.score || 0, fullData.status || 'PENDING',
        fullData.submittedAt || '', fullData.createdAt || new Date().toISOString(), fullData.updatedAt || new Date().toISOString()
      ]);
    } else if (collectionName === 'metrics' || collectionName === 'visitor_activities') {
      const details = typeof fullData.details === 'string' ? fullData.details : JSON.stringify(fullData.details || {});
      await conn.query(`
        INSERT INTO metrics (id, visitor_id, session_id, action_type, page_path, page_title, details, device, browser, os, ip, country, region, referrer, consent_category, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE page_path=VALUES(page_path), page_title=VALUES(page_title)
      `, [
        id, fullData.visitorId || '', fullData.sessionId || '', fullData.actionType || '',
        fullData.pagePath || '', fullData.pageTitle || '', details, fullData.device || '',
        fullData.browser || '', fullData.os || '', fullData.ip || '', fullData.country || '',
        fullData.region || '', fullData.referrer || '', fullData.consentCategory || '',
        fullData.timestamp || new Date().toISOString()
      ]);
    } else if (collectionName === 'pages') {
      await conn.query(`
        INSERT INTO pages (id, slug, title, content, meta_description, is_published, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug=VALUES(slug), title=VALUES(title), content=VALUES(content),
          meta_description=VALUES(meta_description), is_published=VALUES(is_published),
          updated_at=VALUES(updated_at)
      `, [
        id, fullData.slug || id, fullData.title || '', fullData.content || '',
        fullData.metaDescription || '', fullData.isPublished !== false ? 1 : 0,
        fullData.createdAt || new Date().toISOString(), fullData.updatedAt || new Date().toISOString()
      ]);
    } else {
      // Generic entity insertion
      const jsonData = JSON.stringify(fullData);
      await conn.query(`
        INSERT INTO generic_entities (collection_name, id, data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE data=VALUES(data), updated_at=VALUES(updated_at)
      `, [collectionName, id, jsonData, fullData.createdAt || new Date().toISOString(), fullData.updatedAt || new Date().toISOString()]);
    }
  } catch (err: any) {
    console.warn(`[MySQL SAVE ${collectionName}/${id} Notice]:`, err?.message || err);
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteCollectionDoc(collectionName: string, id: string): Promise<void> {
  getMemoryCollection(collectionName).delete(id);

  const currentPool = getMySQLPool();
  if (!currentPool) return;

  let conn: PoolConnection | null = null;
  try {
    conn = await currentPool.getConnection();
    const tableMap: Record<string, string> = {
      journals: 'journals',
      issues: 'issues',
      articles: 'articles',
      news: 'news',
      announcements: 'news',
      users: 'users',
      submissions: 'submissions',
      manuscripts: 'submissions',
      reviews: 'reviews',
      metrics: 'metrics',
      visitor_activities: 'metrics',
      pages: 'pages',
      editors: 'editors',
      invoices: 'invoices',
      subscribers: 'subscribers',
      live_chats: 'live_chats'
    };

    const tableName = tableMap[collectionName];
    if (tableName) {
      await conn.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    } else if (collectionName === 'settings') {
      await conn.query('DELETE FROM settings WHERE key_name = ?', [id]);
    } else {
      await conn.query('DELETE FROM generic_entities WHERE collection_name = ? AND id = ?', [collectionName, id]);
    }
  } catch (err: any) {
    console.warn(`[MySQL DELETE ${collectionName}/${id} Notice]:`, err?.message || err);
  } finally {
    if (conn) conn.release();
  }
}
