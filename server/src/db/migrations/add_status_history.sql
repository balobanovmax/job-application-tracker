-- Status history for application pipeline tracking

CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('applied', 'interview', 'offer', 'rejected')),
    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_application_id
    ON application_status_history(application_id);

CREATE INDEX IF NOT EXISTS idx_status_history_changed_at
    ON application_status_history(changed_at);

-- Backfill existing applications with their current status
INSERT INTO application_status_history (application_id, status, changed_at)
SELECT a.id, a.status, COALESCE(a.date_applied::timestamp, a.created_at)
FROM applications a
WHERE NOT EXISTS (
    SELECT 1
    FROM application_status_history h
    WHERE h.application_id = a.id
);
