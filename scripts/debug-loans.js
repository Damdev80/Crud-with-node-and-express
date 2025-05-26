import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load server environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

// Apply temp env fix
import '../server/temp-env-fix.js';

import ModelFactory from '../server/models/model-factory.js';

(async () => {
  console.log('🔍 [DEBUG-LOANS] DB_PROVIDER:', process.env.DB_PROVIDER);
  try {
    const loans = await ModelFactory.Loan.getAllWithDetails();
    console.log('🔍 [DEBUG-LOANS] Loans returned:', loans.length);
    console.log(JSON.stringify(loans, null, 2));
  } catch (error) {
    console.error('❌ [DEBUG-LOANS] Error fetching loans:', error);
    process.exit(1);
  }
})();
