// dikerjakan oleh: distania_9

require('dotenv').config();
const path = require('path');
const newman = require('newman');
const pool = require('../src/config/database');
const createApp = require('../src/app');

async function verifyDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('Koneksi ke basis data PostgreSQL lokal terverifikasi.');
  } catch (err) {
    console.error('\n[DATABASE CONNECTION ERROR]');
    console.error('Tidak dapat terhubung ke server PostgreSQL lokal.');
    console.error(`Host: ${process.env.PGHOST || 'localhost'}, Port: ${process.env.PGPORT || 5432}, User: ${process.env.PGUSER || 'postgres'}, Database: ${process.env.PGDATABASE || 'openjob_db'}`);
    console.error('Pastikan PostgreSQL telah berjalan secara lokal dan kredensial pada berkas .env sudah sesuai.');
    console.error(`Detail error: ${err.message}\n`);
    throw err;
  }
}

async function cleanDatabase() {
  console.log('Membersihkan tabel basis data untuk pengujian...');
  await pool.query(
    'TRUNCATE TABLE authentications, bookmarks, applications, jobs, categories, companies, users CASCADE'
  );
  console.log('Tabel basis data berhasil dibersihkan.');
}

async function runTests() {
  try {
    await verifyDatabaseConnection();
  } catch (err) {
    process.exit(1);
  }

  const app = createApp();
  const port = process.env.PORT || 3000;
  const server = app.listen(port, async () => {
    console.log(`Server pengujian berjalan pada port ${port}`);

    try {
      await cleanDatabase();

      const collectionPath = path.resolve('Postman/[271] OpenJob API Test V1.postman_collection.json');
      const environmentPath = path.resolve('Postman/OpenJob API.postman_environment.json');

      console.log('Memulai runner Newman...');
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
            console.error('Newman mengalami error eksekusi:', err);
            process.exit(1);
          }

          const stats = summary.run.stats;
          console.log('\n=============================================');
          console.log('            RINGKASAN HASIL PENGUJIAN');
          console.log('=============================================');
          console.log(`Requests:   Total: ${stats.requests.total}, Gagal: ${stats.requests.failed}`);
          console.log(`Assertions: Total: ${stats.assertions.total}, Gagal: ${stats.assertions.failed}`);

          if (summary.run.failures.length > 0) {
            console.log('\n--- DAFTAR KEGAGALAN ---');
            summary.run.failures.forEach((f, idx) => {
              console.log(`${idx + 1}. [${f.source.name}] ${f.error.test}: ${f.error.message}`);
            });
            process.exit(1);
          } else {
            console.log('\nSELURUH PENGUJIAN BERHASIL LULUS! (100% PASS RATE)');
            process.exit(0);
          }
        }
      );
    } catch (dbErr) {
      console.error('Pengaturan basis data gagal:', dbErr);
      server.close();
      await pool.end();
      process.exit(1);
    }
  });
}

runTests();
