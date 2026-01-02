-- Migration: Add notes field to applications table
-- Date: 2026-01-02

ALTER TABLE applications
ADD COLUMN notes TEXT;

-- Add constraint for max length (50 characters)
ALTER TABLE applications
ADD CONSTRAINT notes_length_check CHECK (notes IS NULL OR LENGTH(notes) <= 50);

