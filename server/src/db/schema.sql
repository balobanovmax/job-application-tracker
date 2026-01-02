CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth0_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('applied', 'interview', 'offer', 'rejected')) DEFAULT 'applied',
    date_applied DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- indexes 
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date_applied ON applications(date_applied);
CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_users_email ON users(email);

