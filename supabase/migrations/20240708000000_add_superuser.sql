
-- Add a superuser admin account with username 'su-user@poisemusic.com' and password 'adminpass123'
INSERT INTO public.admin_users (username, password_hash, is_superadmin)
VALUES ('su-user@poisemusic.com', 'adminpass123', true)
ON CONFLICT (username) 
DO UPDATE SET 
  password_hash = 'adminpass123',
  is_superadmin = true;
