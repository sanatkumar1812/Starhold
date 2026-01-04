-- Add share_token column for shareable links
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Create index for fast share token lookups
CREATE INDEX IF NOT EXISTS idx_memories_share_token ON public.memories(share_token);

-- Create policy to allow anyone to view shared memories via share token
CREATE POLICY "Anyone can view memories with share token"
ON public.memories
FOR SELECT
USING (share_token IS NOT NULL);

-- Create storage bucket for memory attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memory-attachments', 'memory-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for memory attachments
CREATE POLICY "Users can upload their own attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own attachments"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
USING (bucket_id = 'memory-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Memory attachments are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'memory-attachments');