import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeQuizMigration() {
    try {
        console.log('📊 Starting quiz migration...\n');

        // Read the SQL file
        const sqlPath = join(__dirname, '../sql/add_more_quizzes.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 SQL migration file loaded');
        console.log('⚠️  Note: This script requires manual execution in Supabase SQL Editor\n');
        console.log('Please follow these steps:');
        console.log('1. Open your Supabase project dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Create a new query');
        console.log('4. Copy and paste the content from:');
        console.log('   backend/sql/add_more_quizzes.sql');
        console.log('5. Click "Run" to execute\n');

        // Get current count before migration
        const { count: beforeCount } = await supabase
            .from('exercises')
            .select('*', { count: 'exact', head: true });

        console.log(`📈 Current quiz count: ${beforeCount}`);
        console.log(`🎯 Expected after migration: ${beforeCount + 40} (adding 40 quizzes)\n`);

        console.log('💡 After executing the SQL in Supabase, run:');
        console.log('   node scripts/analyze-quizzes.js');
        console.log('   to verify the migration\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

executeQuizMigration();
