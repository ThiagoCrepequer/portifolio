-- Migration 0001: Add CMS fields to the post table.
--
-- Additive only -- safe to run against the existing production database.
-- Idempotent where SQLite supports it (indexes and triggers, not columns).
--
-- Apply with:
--   wrangler d1 execute blog --remote --file=database/migrations/0001_add_cms_fields.sql
--   wrangler d1 execute blog --local  --file=database/migrations/0001_add_cms_fields.sql

ALTER TABLE post ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE post ADD COLUMN cover_image TEXT;
ALTER TABLE post ADD COLUMN author TEXT;
ALTER TABLE post ADD COLUMN content_html TEXT;

CREATE INDEX IF NOT EXISTS idx_post_status_created ON post(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_category ON post(category);

-- Auto-update `updated_at` on every UPDATE
CREATE TRIGGER IF NOT EXISTS post_updated_at
AFTER UPDATE ON post
BEGIN
  UPDATE post SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
