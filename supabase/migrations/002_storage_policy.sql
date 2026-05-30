CREATE POLICY "public read roast images" ON storage.objects
  FOR SELECT USING (bucket_id = 'roast-images');
