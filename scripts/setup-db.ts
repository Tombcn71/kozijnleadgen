/**
 * Database Setup Script
 * Voert migrations uit op de Neon database
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load .env.local
config({ path: join(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Read migration file
    const migrationPath = join(process.cwd(), 'migrations', '001_initial.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📝 Executing migration...');
    
    // Split SQL by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          // Use template literal syntax for Neon
          await sql.unsafe(statement);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (!error.message?.includes('already exists')) {
            console.error(`Error executing statement: ${statement.substring(0, 50)}...`);
            throw error;
          }
        }
      }
    }
    
    console.log('✅ Migration executed successfully');

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

