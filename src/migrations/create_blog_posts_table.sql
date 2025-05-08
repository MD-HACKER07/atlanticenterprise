-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  date VARCHAR NOT NULL,
  author VARCHAR NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image VARCHAR NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);

-- Create index on published status for filtering
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (published);

-- Create RLS policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for everyone to view published posts
CREATE POLICY blog_posts_select_policy ON blog_posts
  FOR SELECT
  USING (published = TRUE OR auth.role() = 'authenticated');

-- Policy for authenticated users to insert blog posts
CREATE POLICY blog_posts_insert_policy ON blog_posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update blog posts
CREATE POLICY blog_posts_update_policy ON blog_posts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete blog posts
CREATE POLICY blog_posts_delete_policy ON blog_posts
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at column
CREATE TRIGGER blog_posts_updated_at_trigger
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 