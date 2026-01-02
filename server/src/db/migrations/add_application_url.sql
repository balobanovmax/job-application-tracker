-- Migration: Add application_url field to applications table
-- Date: 2026-01-02

ALTER TABLE applications
ADD COLUMN application_url TEXT;

