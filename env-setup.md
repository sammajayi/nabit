# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Keep your existing variables
REDIS_URL=your-redis-url
REDIS_TOKEN=your-redis-token
```

## How to get your Supabase credentials:

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the "Project URL" to `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the "anon public" key to `NEXT_PUBLIC_SUPABASE_ANON_KEY` 