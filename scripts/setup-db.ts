/**
 * Database Setup Script
 * Voert migrations uit op de Neon database
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: join(process.cwd(), '.env.local') });

import { sql } from '../lib/db';

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Read migration file
    const migrationPath = join(process.cwd(), 'migrations', '001_initial.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📝 Executing migration...');
    
    // Execute the entire migration as one query
    // Neon serverless supports multi-statement queries
    try {
      await sql(migrationSQL);
      console.log('✅ Migration executed successfully');
    } catch (error: any) {
      // Check if it's just "already exists" errors (tables might already exist)
      if (error.message?.includes('already exists')) {
        console.log('⚠️  Some tables already exist (this is OK)');
      } else {
        throw error;
      }
    }

    console.log('✅ Database setup complete!\n');
    
    // Verify tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📊 Created tables:');
    tables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();

