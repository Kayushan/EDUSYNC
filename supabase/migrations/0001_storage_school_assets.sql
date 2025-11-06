-- Create storage bucket for school assets (logos, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-assets', 'school-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for school assets
CREATE POLICY "Public Access for School Logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'school-assets');

CREATE POLICY "Authenticated users can upload school assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'school-assets' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own school assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'school-assets' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own school assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'school-assets' 
  AND auth.role() = 'authenticated'
);
