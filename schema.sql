-- =============================================================================
-- Academic Journal Platform (AJP) - MySQL Schema
-- =============================================================================
-- This file mirrors exactly what the application creates automatically at
-- startup (see src/db/mysql.ts -> initMySQLSchema()). The app runs these same
-- CREATE TABLE IF NOT EXISTS statements itself the first time it connects to
-- an empty database, so importing this file manually is OPTIONAL — it's
-- provided so you can review the schema up front, import it during a manual
-- cPanel/phpMyAdmin setup, or version-control it independently of the app.
--
-- Usage:
--   mysql -u your_db_user -p your_db_name < schema.sql
-- =============================================================================

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

CREATE TABLE IF NOT EXISTS settings (
        key_name VARCHAR(128) PRIMARY KEY,
        setting_value JSON,
        updated_at VARCHAR(128)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS generic_entities (
        collection_name VARCHAR(128) NOT NULL,
        id VARCHAR(128) NOT NULL,
        data JSON NOT NULL,
        created_at VARCHAR(128),
        updated_at VARCHAR(128),
        PRIMARY KEY (collection_name, id),
        INDEX idx_generic_collection (collection_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
