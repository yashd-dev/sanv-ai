-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP,
    tier_id UUID REFERENCES user_tiers(id) DEFAULT (SELECT id FROM user_tiers WHERE name = 'free')
);

-- CHAT SESSIONS (1 LLM per session)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES users(id),
    title TEXT,
    shareable_link TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP
);

-- WHO JOINED WHAT SESSION
CREATE TABLE session_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT now(),
    UNIQUE (session_id, user_id)
);

-- MESSAGES IN THE SESSION (USER or LLM)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id), -- NULL if LLM
    role TEXT CHECK (role IN ('user', 'assistant', 'system')) DEFAULT 'user',
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    is_llm_response BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
);

-- TYPING STATE (REAL-TIME STATUS)
CREATE TABLE typing_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_typing BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT now(),
    UNIQUE (session_id, user_id)
);

-- OPTIONAL: SESSION CONFIGURATION FOR LLM
CREATE TABLE session_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID UNIQUE NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    model TEXT DEFAULT 'gpt-4',
    temperature FLOAT DEFAULT 0.7,
    max_tokens INT,
    top_p FLOAT,
    frequency_penalty FLOAT,
    presence_penalty FLOAT
);

-- in psql
CREATE EXTENSION IF NOT EXISTS vector;


CREATE TABLE message_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    embedding VECTOR(1536), -- 1536 for OpenAI text-embedding-ada-002
    created_at TIMESTAMP DEFAULT now()
);

-- Optional index for fast ANN search (HNSW)
CREATE INDEX ON message_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- USER TIERS AND SUBSCRIPTIONS
CREATE TABLE user_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    max_sessions INT,
    max_messages_per_session INT,
    max_embeddings INT,
    created_at TIMESTAMP DEFAULT now()
);

-- Insert default tiers
INSERT INTO user_tiers (name, price_monthly, price_yearly, max_sessions, max_messages_per_session, max_embeddings) VALUES
    ('free', 0, 0, 3, 50, 100),
    ('pro', 999, 9999, 100, 1000, 10000);  -- Prices in INR (₹)

-- USER SUBSCRIPTIONS
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES user_tiers(id),
    razorpay_customer_id TEXT,
    razorpay_subscription_id TEXT,
    razorpay_plan_id TEXT,
    status TEXT CHECK (status IN ('active', 'cancelled', 'completed', 'authenticated', 'created')),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- PAYMENT HISTORY
CREATE TABLE payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Add usage tracking
CREATE TABLE user_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_count INT DEFAULT 0,
    message_count INT DEFAULT 0,
    embedding_count INT DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);