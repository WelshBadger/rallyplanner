-- Create table for assigning team members to specific rallies
CREATE TABLE IF NOT EXISTS rally_team_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rally_id UUID NOT NULL REFERENCES rally_events(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rally_id, team_member_id)
);

-- Enable RLS
ALTER TABLE rally_team_assignments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own rally team assignments"
  ON rally_team_assignments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rally team assignments"
  ON rally_team_assignments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rally team assignments"
  ON rally_team_assignments FOR DELETE
  USING (auth.uid() = user_id);
