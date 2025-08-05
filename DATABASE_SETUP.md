# Database Setup Guide

### 1. Set Up Supabase Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire content from `database-schema.sql`
4. Click "Run" to create all tables and policies

### 2. Get Your Supabase Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy the Project URL → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Keep your existing variables
REDIS_URL=your-redis-url
REDIS_TOKEN=your-redis-token
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Test Database Connection

Run the test script to verify everything works:

```bash
node scripts/test-database.js
```

This will test:
- Database connection
- Table creation
- User creation
- Product creation
- Data queries
- Cleanup

### 6. Migrate Existing Data (Optional)

If you have existing products in your JSON file:

```bash
node scripts/migrate-data.js
```

### 7. Start Development

```bash
npm run dev
```

## Database Schema

### Tables Created:

1. **users** - Store Farcaster user information
2. **products** - Store all product listings
3. **orders** - Store purchase transactions

### Key Features:

- Row Level Security (RLS) - Data protection
- Automatic timestamps - Created/updated tracking
- Foreign key relationships - Data integrity
- Indexes - Fast queries
- Type safety - Full TypeScript support

## API Changes

Your existing API endpoints now use the database:

- `GET /api/products` - Fetch products from database
- `POST /api/products` - Create products in database
- All existing frontend code will work unchanged

## Security Features

- Row Level Security - Users can only access their own data
- Input validation - All data is validated
- SQL injection protection - Supabase handles this automatically
- Rate limiting - Built into Supabase

## Benefits

- Scalable - Handles thousands of users
- Real-time - Live updates possible
- Reliable - PostgreSQL under the hood
- Fast - Optimized queries and indexes
- Secure - Enterprise-grade security

## Troubleshooting

### Common Issues:

1. **"Missing environment variables"**
   - Check your `.env.local` file exists
   - Verify Supabase URL and key are correct

2. **"Permission denied"**
   - Run the SQL schema in Supabase dashboard
   - Check RLS policies are created

3. **"Connection failed"**
   - Verify your Supabase project is active
   - Check internet connection

### Need Help?

- Check Supabase logs in dashboard
- Verify environment variables
- Test with a simple query first
- Run `node scripts/test-database.js` to diagnose issues
