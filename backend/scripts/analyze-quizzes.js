import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

async function analyzeQuizzes() {
    try {
        // Get all lessons
        const { data: lessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('id, lesson_number, title')
            .order('lesson_number');

        if (lessonsError) throw lessonsError;

        console.log('📊 Quiz Distribution Analysis\n');
        console.log('='.repeat(80));

        let totalQuizzes = 0;

        for (const lesson of lessons) {
            // Get exercises for this lesson
            const { data: exercises, error: exercisesError } = await supabase
                .from('exercises')
                .select('id, question_type, difficulty')
                .eq('lesson_id', lesson.id);

            if (exercisesError) throw exercisesError;

            const quizCount = exercises.length;
            totalQuizzes += quizCount;

            // Count by difficulty
            const easy = exercises.filter(e => e.difficulty === 'easy').length;
            const medium = exercises.filter(e => e.difficulty === 'medium').length;
            const hard = exercises.filter(e => e.difficulty === 'hard').length;

            // Count by type
            const types = {};
            exercises.forEach(e => {
                types[e.question_type] = (types[e.question_type] || 0) + 1;
            });

            console.log(`\nLesson ${lesson.lesson_number}: ${lesson.title}`);
            console.log(`  Total Quizzes: ${quizCount}`);
            console.log(`  Difficulty: Easy=${easy}, Medium=${medium}, Hard=${hard}`);
            console.log(`  Types: ${Object.entries(types).map(([k, v]) => `${k}=${v}`).join(', ')}`);
        }

        console.log('\n' + '='.repeat(80));
        console.log(`\n📈 Summary:`);
        console.log(`  Total Lessons: ${lessons.length}`);
        console.log(`  Total Quizzes: ${totalQuizzes}`);
        console.log(`  Average per Lesson: ${(totalQuizzes / lessons.length).toFixed(1)}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

analyzeQuizzes();
