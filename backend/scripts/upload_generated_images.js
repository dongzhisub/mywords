import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES_DIR = path.join(__dirname, 'generated_images');
const BUCKET_NAME = 'phonetics-images';

async function uploadImages() {
    try {
        if (!fs.existsSync(IMAGES_DIR)) {
            console.error(`Directory not found: ${IMAGES_DIR}`);
            return;
        }

        const files = fs.readdirSync(IMAGES_DIR);
        console.log(`Found ${files.length} files in ${IMAGES_DIR}`);

        for (const file of files) {
            if (file.startsWith('.')) continue;

            const filePath = path.join(IMAGES_DIR, file);
            const fileBuffer = fs.readFileSync(filePath);
            const fileName = file; // Keep original filename

            console.log(`Uploading ${fileName}...`);

            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, fileBuffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (error) {
                console.error(`Error uploading ${fileName}:`, error.message);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(fileName);

                console.log(`Uploaded successfully: ${publicUrl}`);
            }
        }
    } catch (error) {
        console.error('Script error:', error);
    }
}

uploadImages();
