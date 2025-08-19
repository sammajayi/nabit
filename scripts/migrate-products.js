import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateProducts() {
  try {
    console.log('Starting product migration...');
    
    // Read products from JSON file
    const productsFile = path.join(__dirname, '..', 'app/api/products/products.json');
    const productsData = await fs.readFile(productsFile, 'utf-8');
    const products = JSON.parse(productsData);
    
    console.log(`Found ${products.length} products to migrate`);
    
    for (const product of products) {
      // First, ensure user exists
      const { error: userError } = await supabase
        .from('users')
        .upsert({ 
          fid: product.fid,
          display_name: product.seller_display_name,
          pfp_url: product.seller_image,
          created_at: new Date().toISOString()
        });

      if (userError) {
        console.error('Error upserting user:', userError);
        continue;
      }

      // Insert product
      const newProduct = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category,
        images: product.images || [],
        document: product.document,
        fid: product.fid,
        seller_image: product.seller_image,
        seller_display_name: product.seller_display_name,
        created_at: product.createdAt || new Date().toISOString()
      };

      const { error } = await supabase
        .from('products')
        .insert(newProduct)
        .select()
        .single();

      if (error) {
        console.error('Error migrating product:', product.name, error);
      } else {
        console.log('✅ Migrated product:', product.name);
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateProducts();
