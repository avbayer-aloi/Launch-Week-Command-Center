-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create launches table
CREATE TABLE launches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'Ready', 'Shipped')),
  launch_date DATE,
  owner TEXT,
  checklist JSONB DEFAULT '{"blog": false, "demo": false, "social": false, "partner": false, "docs": false}',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  user_name TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for demo - in production, you'd want proper auth)
CREATE POLICY "Allow all operations on launches" ON launches FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_log" ON activity_log FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_launches_updated_at 
    BEFORE UPDATE ON launches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO launches (title, description, status, launch_date, owner, checklist, tags) VALUES
('Supabase Edge Functions 2.0', 'Next generation serverless functions with improved performance and developer experience', 'In Progress', '2024-11-15', 'Alex Chen', '{"blog": true, "demo": false, "social": true, "partner": false, "docs": true}', ARRAY['edge-functions', 'serverless', 'performance']),
('Real-time Dashboard Templates', 'Pre-built dashboard components for real-time applications', 'Planning', '2024-11-22', 'Sarah Kim', '{"blog": false, "demo": false, "social": false, "partner": false, "docs": false}', ARRAY['templates', 'real-time', 'dashboard']),
('PostgreSQL 16 Support', 'Full support for PostgreSQL 16 with new features and optimizations', 'Ready', '2024-11-08', 'Marcus Johnson', '{"blog": true, "demo": true, "social": true, "partner": true, "docs": true}', ARRAY['postgresql', 'database', 'upgrade']),
('Auth UI Components 3.0', 'Modern, customizable authentication components with better UX', 'Shipped', '2024-10-25', 'Emma Wilson', '{"blog": true, "demo": true, "social": true, "partner": true, "docs": true}', ARRAY['auth', 'ui', 'components']);

-- Insert sample activity log entries
INSERT INTO activity_log (action, user_name, details) VALUES
('Launch created', 'Alex Chen', '{"launch_title": "Supabase Edge Functions 2.0"}'),
('Status updated', 'Sarah Kim', '{"launch_title": "Real-time Dashboard Templates", "from": "Planning", "to": "In Progress"}'),
('Checklist updated', 'Marcus Johnson', '{"launch_title": "PostgreSQL 16 Support", "item": "blog", "completed": true}'),
('Launch shipped', 'Emma Wilson', '{"launch_title": "Auth UI Components 3.0"}'),
('Content generated', 'Alex Chen', '{"type": "announcement", "launch_title": "Supabase Edge Functions 2.0"}');