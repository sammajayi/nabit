const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateProducts() {
  try {
    // Read existing products from JSON file
    const productsFile = path.join(process.cwd(), 'app/api/products/products.json');
    const productsData = await fs.readFile(productsFile, 'utf-8');
    const products = JSON.parse(productsData);

    console.log(`Found ${products.length} products to migrate`);

    for (const product of products) {
      // Transform the data to match our new schema
      const newProduct = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category,
        images: product.images || [],
        document: product.document || null,
        fid: product.fid,
        seller_image: product.seller_image || null,
        seller_display_name: product.seller_display_name || null,
      };

      // Insert into database
      const { data, error } = await supabase
        .from('products')
        .insert(newProduct)
        .select()
        .single();

      if (error) {
        console.error(`Error migrating product ${product.name}:`, error);
      } else {
        console.log(`✅ Migrated: ${product.name}`);
      }
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateProducts(); 