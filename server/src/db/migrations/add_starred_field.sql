-- Migration: Add starred field to applications table
-- Date: 2026-01-03

-- Add starred column (defaults to FALSE for existing applications)
ALTER TABLE applications 
ADD COLUMN starred BOOLEAN DEFAULT FALSE;

-- Add index for starred field (for filtering)
CREATE INDEX idx_applications_starred ON applications(starred);

-- Verify the column was added
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'applications' AND column_name = 'starred';

