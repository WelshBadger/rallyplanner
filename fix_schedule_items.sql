-- Verify table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'schedule_items';

-- Create schedule_items table if not exists
CREATE TABLE IF NOT EXISTS schedule_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rally_id UUID NOT NULL REFERENCES rally_events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_type TEXT DEFAULT 'other',
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own schedule items"
ON schedule_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own schedule items"
ON schedule_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule items"
ON schedule_items FOR DELETE
USING (auth.uid() = user_id);
