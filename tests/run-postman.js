// dikerjakan oleh: distania_9

require('dotenv').config();
const path = require('path');
const newman = require('newman');
const pool = require('../src/config/database');
const createApp = require('../src/app');

async function cleanDatabase() {
  console.log('Cleaning database tables for clean test run...');
  await pool.query(
    'TRUNCATE TABLE authentications, bookmarks, applications, jobs, categories, companies, users CASCADE'
  );
  console.log('Database tables truncated successfully.');
}

async function runTests() {
  const app = createApp();
  const port = process.env.PORT || 3000;
  const server = app.listen(port, async () => {
    console.log(`Test server running on port ${port}`);

    try {
      await cleanDatabase();

      const collectionPath = path.resolve('Postman/[271] OpenJob API Test V1.postman_collection.json');
      const environmentPath = path.resolve('Postman/OpenJob API.postman_environment.json');

      console.log('Starting Newman test runner...');
      newman.run(
        {
          collection: collectionPath,
          environment: environmentPath,
          reporters: ['cli'],
          bail: false,
        },
        async (err, summary) => {
          server.close();
          await pool.end();

          if (err) {
            console.error('Newman run encountered an error:', err);
            process.exit(1);
          }

          const stats = summary.run.stats;
          console.log('\n=============================================');
          console.log('            TEST RUN SUMMARY');
          console.log('=============================================');
          console.log(`Requests:   Total: ${stats.requests.total}, Failed: ${stats.requests.failed}`);
          console.log(`Assertions: Total: ${stats.assertions.total}, Failed: ${stats.assertions.failed}`);

          if (summary.run.failures.length > 0) {
            console.log('\n--- FAILURES ---');
            summary.run.failures.forEach((f, idx) => {
              console.log(`${idx + 1}. [${f.source.name}] ${f.error.test}: ${f.error.message}`);
            });
            process.exit(1);
          } else {
            console.log('\nALL TESTS PASSED SUCCESSFULLY! (100% PASS RATE)');
            process.exit(0);
          }
        }
      );
    } catch (dbErr) {
      console.error('Database setup failed:', dbErr);
      server.close();
      await pool.end();
      process.exit(1);
    }
  });
}

runTests();
