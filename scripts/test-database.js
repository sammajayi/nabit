const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('Please check your .env.local file has:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  console.log(' Testing database connection...');
  
  try {
    // Test 1: Check if tables exist
    console.log('1. Checking if tables exist...');
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (tablesError) {
      console.error('Error accessing users table:', tablesError.message);
      console.log(' Make sure you ran the database-schema.sql in Supabase');
      return;
    }
    
    console.log(' Users table accessible');
    
    // Test 2: Insert a test user
    console.log('2. Testing user creation...');
    const testFid = 'test-fid-' + Date.now();
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({ fid: testFid })
      .select()
      .single();
    
    if (userError) {
      console.error(' Error creating test user:', userError.message);
      return;
    }
    
    console.log(' Test user created:', user.fid);
    
    // Test 3: Insert a test product
    console.log('3. Testing product creation...');
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        category: 'test',
        fid: testFid,
        images: []
      })
      .select()
      .single();
    
    if (productError) {
      console.error(' Error creating test product:', productError.message);
      return;
    }
    
    console.log('Test product created:', product.name);
    
    // Test 4: Query products
    console.log('4. Testing product query...');
    const { data: products, error: queryError } = await supabase
      .from('products')
      .select('*')
      .eq('fid', testFid);
    
    if (queryError) {
      console.error('Error querying products:', queryError.message);
      return;
    }
    
    console.log(' Products query successful, found:', products.length, 'products');
    
    // Test 5: Clean up test data
    console.log('5. Cleaning up test data...');
    await supabase.from('products').delete().eq('fid', testFid);
    await supabase.from('users').delete().eq('fid', testFid);
    
    console.log(' Test data cleaned up');
    
    console.log('\n All database tests passed! Your setup is working correctly.');
    
  } catch (error) {
    console.error('Database test failed:', error.message);
    console.log('\n Troubleshooting tips:');
    console.log('1. Check your .env.local file has correct Supabase credentials');
    console.log('2. Make sure you ran database-schema.sql in Supabase dashboard');
    console.log('3. Verify your Supabase project is active');
  }
}

testDatabase(); 