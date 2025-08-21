-- MySQL schema (InnoDB, utf8mb4)
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- USERS & PROFILES
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED UNIQUE,
  title VARCHAR(64),
  first_name VARCHAR(150),
  last_name VARCHAR(150),
  display_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(50),
  department_id BIGINT UNSIGNED,
  position VARCHAR(255),
  bio TEXT,
  metadata JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE departments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50),
  name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ROLES / RBAC
CREATE TABLE roles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PROJECTS & MEMBERS
CREATE TABLE projects (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(128),
  title_th TEXT,
  title_en TEXT,
  abstract_th LONGTEXT,
  abstract_en LONGTEXT,
  year_start INT,
  year_end INT,
  budget DECIMAL(14,2),
  funding_type VARCHAR(100),
  ic_type VARCHAR(100),
  impact VARCHAR(255),
  sdg VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  visibility VARCHAR(50) NOT NULL DEFAULT 'private',
  metadata JSON,
  created_by BIGINT UNSIGNED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE project_members (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  affiliation VARCHAR(255),
  department_id BIGINT UNSIGNED,
  role VARCHAR(100),            -- PI, Co-PI, Member, Corresponding Author
  contribution_percent DECIMAL(5,2) DEFAULT 0,
  is_contact TINYINT(1) DEFAULT 0,
  has_ic TINYINT(1) DEFAULT 0,
  ic_value DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_pm_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_pm_project ON project_members(project_id);
CREATE INDEX idx_pm_user ON project_members(user_id);

-- ARTICLES (journal publications)
CREATE TABLE articles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title_th TEXT,
  title_en TEXT,
  journal VARCHAR(255),
  year INT,
  doi VARCHAR(255),
  issn VARCHAR(50),
  volume VARCHAR(50),
  issue VARCHAR(50),
  pages VARCHAR(50),
  publisher VARCHAR(255),
  language VARCHAR(50),
  url TEXT,
  abstract LONGTEXT,
  metadata JSON, -- e.g., impact factor, indexed_in array
  created_by BIGINT UNSIGNED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_articles_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_articles_year ON articles(year);
CREATE INDEX idx_articles_doi ON articles(doi);

-- BOOKS
CREATE TABLE books (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title_th TEXT,
  title_en TEXT,
  isbn VARCHAR(50),
  editors TEXT,
  edition VARCHAR(100),
  publisher VARCHAR(255),
  publisher_location VARCHAR(255),
  year INT,
  isbn13 VARCHAR(50),
  metadata JSON,
  created_by BIGINT UNSIGNED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_books_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_books_year ON books(year);

-- CONFERENCES
CREATE TABLE conferences (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title_th TEXT,
  title_en TEXT,
  conference_name VARCHAR(255),
  conference_location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  proceedings_title VARCHAR(255),
  proceedings_doi VARCHAR(255),
  presentation_type VARCHAR(50), -- talk/poster
  year INT,
  metadata JSON,
  created_by BIGINT UNSIGNED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_confs_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_confs_year ON conferences(year);

-- FUNDERS & GRANTS (funding)
CREATE TABLE funders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- government/internal/private
  metadata JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE grants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(128),
  title TEXT,
  funder_id BIGINT UNSIGNED,
  amount_total DECIMAL(14,2),
  currency VARCHAR(10) DEFAULT 'THB',
  start_date DATE,
  end_date DATE,
  status VARCHAR(50),
  metadata JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_grants_funder FOREIGN KEY (funder_id) REFERENCES funders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE project_grants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT UNSIGNED NOT NULL,
  grant_id BIGINT UNSIGNED NOT NULL,
  amount_allocated DECIMAL(14,2),
  note TEXT,
  CONSTRAINT fk_pg_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pg_grant FOREIGN KEY (grant_id) REFERENCES grants(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_pg_project ON project_grants(project_id);
CREATE INDEX idx_pg_grant ON project_grants(grant_id);

-- PUBLICATION AUTHORS (shared across types)
CREATE TABLE publication_authors (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  publication_type ENUM('article','book','conference') NOT NULL,
  publication_id BIGINT UNSIGNED NOT NULL, -- id in respective table
  user_id BIGINT UNSIGNED,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  affiliation VARCHAR(255),
  author_order INT DEFAULT 0,
  author_role VARCHAR(100),
  contribution_percent DECIMAL(5,2) DEFAULT 0,
  CONSTRAINT fk_pa_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_pa_pub ON publication_authors(publication_type, publication_id);

-- Linking publications to projects (separate join tables)
CREATE TABLE project_articles (
  project_id BIGINT UNSIGNED NOT NULL,
  article_id BIGINT UNSIGNED NOT NULL,
  relation_role VARCHAR(100),
  PRIMARY KEY (project_id, article_id),
  CONSTRAINT fk_pa_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pa_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE project_books (
  project_id BIGINT UNSIGNED NOT NULL,
  book_id BIGINT UNSIGNED NOT NULL,
  relation_role VARCHAR(100),
  PRIMARY KEY (project_id, book_id),
  CONSTRAINT fk_pb_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pb_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE project_conferences (
  project_id BIGINT UNSIGNED NOT NULL,
  conference_id BIGINT UNSIGNED NOT NULL,
  relation_role VARCHAR(100),
  PRIMARY KEY (project_id, conference_id),
  CONSTRAINT fk_pc_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_conf FOREIGN KEY (conference_id) REFERENCES conferences(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- FILES / ATTACHMENTS (explicit foreign keys per entity)
CREATE TABLE files (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT UNSIGNED,
  article_id BIGINT UNSIGNED,
  book_id BIGINT UNSIGNED,
  conference_id BIGINT UNSIGNED,
  grant_id BIGINT UNSIGNED,
  profile_id BIGINT UNSIGNED,
  filename VARCHAR(512) NOT NULL,
  url TEXT NOT NULL,
  mime VARCHAR(128),
  size BIGINT,
  storage_key VARCHAR(512),
  uploaded_by BIGINT UNSIGNED,
  metadata JSON,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_files_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_files_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT fk_files_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  CONSTRAINT fk_files_conf FOREIGN KEY (conference_id) REFERENCES conferences(id) ON DELETE CASCADE,
  CONSTRAINT fk_files_grant FOREIGN KEY (grant_id) REFERENCES grants(id) ON DELETE CASCADE,
  CONSTRAINT fk_files_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_files_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_files_owner ON files(project_id, article_id, book_id, conference_id, grant_id, profile_id);

-- AUDIT LOGS
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_id BIGINT UNSIGNED,
  action VARCHAR(255) NOT NULL,
  target_type VARCHAR(100),
  target_id BIGINT UNSIGNED,
  payload JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;