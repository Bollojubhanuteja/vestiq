const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = process.argv[2]?.toLowerCase();

if (target !== 'postgres' && target !== 'sqlite') {
  console.log('Usage: node scripts/switch-db.js [postgres|sqlite]');
  process.exit(1);
}

const root = process.cwd();
const schemaPath = path.join(root, 'prisma', 'schema.prisma');
const pgSchemaPath = path.join(root, 'prisma', 'schema.postgresql.prisma');
const sqliteSchemaPath = path.join(root, 'prisma', 'schema.sqlite.prisma');

// Ensure schema.sqlite.prisma backup exists
if (!fs.existsSync(sqliteSchemaPath)) {
  const current = fs.readFileSync(schemaPath, 'utf8');
  if (current.includes('provider = "sqlite"')) {
    fs.writeFileSync(sqliteSchemaPath, current);
  }
}

if (target === 'postgres') {
  console.log('Switching Prisma schema to PostgreSQL...');
  const pgContent = fs.readFileSync(pgSchemaPath, 'utf8');
  fs.writeFileSync(schemaPath, pgContent);
  console.log('Running prisma generate for PostgreSQL...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Successfully configured Vestiq for PostgreSQL!');
  console.log('Ensure your DATABASE_URL environment variable is set to your PostgreSQL connection string.');
} else {
  console.log('Switching Prisma schema to SQLite...');
  const sqliteContent = fs.readFileSync(sqliteSchemaPath, 'utf8');
  fs.writeFileSync(schemaPath, sqliteContent);
  console.log('Running prisma generate for SQLite...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Successfully restored Vestiq for SQLite!');
}
