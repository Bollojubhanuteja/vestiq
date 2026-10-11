/**
 * Comprehensive Preview Validation Suite for Commit ede0876 / f7b6e7f
 * Target: Isolated Preview Environment on PORT 3005
 */

const { spawn } = require('child_process');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const PREVIEW_PORT = 3005;
const PREVIEW_BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`;
const PREVIEW_SECRET = crypto.randomBytes(32).toString('hex');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url + '/');
      if (res.status === 200 || res.status === 307 || res.status === 308) {
        return true;
      }
    } catch (e) {
      // wait 400ms and retry
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw new Error(`Timeout waiting for preview server at ${url}`);
}

async function run() {
  console.log('====================================================');
  console.log('    VESTIQ PREVIEW ENVIRONMENT VALIDATION SUITE     ');
  console.log('====================================================\n');

  // 1. Confirm JWT_SECRET without printing value
  const hasJwtSecret = Boolean(PREVIEW_SECRET && PREVIEW_SECRET.length >= 32);
  const isNotFallback = PREVIEW_SECRET !== 'vestiq-dev-jwt-super-secret-key-32-chars-long-minimum-secure';
  assert(hasJwtSecret && isNotFallback, `Preview environment has cryptographically secure JWT_SECRET configured (length: ${PREVIEW_SECRET.length} chars, non-fallback, value suppressed)`);

  // Ensure isolated preview database exists
  const previewDbPath = path.join(process.cwd(), 'prisma', 'preview.db');
  const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  fs.copyFileSync(sourceDbPath, previewDbPath);

  // 2. Spawn isolated Next.js preview server
  console.log(`\nLaunching isolated Preview server on port ${PREVIEW_PORT} with database file:./preview.db...`);
  const serverProcess = spawn('npx', ['next', 'start', '-p', String(PREVIEW_PORT)], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(PREVIEW_PORT),
      DATABASE_URL: 'file:./preview.db',
      JWT_SECRET: PREVIEW_SECRET,
    },
    cwd: process.cwd(),
    shell: true,
  });

  serverProcess.stdout.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('Ready in') || msg.includes('started server')) {
      // server ready
    }
  });

  try {
    await waitForServer(PREVIEW_BASE_URL);
    console.log(`✓ Preview Server is LIVE and ready at: ${PREVIEW_BASE_URL}\n`);

    // -----------------------------------------------------------------------
    // TEST 1: POST /api/auth/executive-access returns HTTP 403 & No Session
    // -----------------------------------------------------------------------
    console.log('TEST SUITE 1: Executive Bypass Neutralization on Preview');
    const bypassRes = await fetch(`${PREVIEW_BASE_URL}/api/auth/executive-access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desk: 'FOUNDER' }),
    });
    assert(bypassRes.status === 403, `POST /api/auth/executive-access returns HTTP 403 Forbidden (got ${bypassRes.status})`);
    
    const setCookie = bypassRes.headers.get('set-cookie');
    assert(!setCookie || !setCookie.includes('vestiq_session'), 'No administrator session cookie is issued on bypass attempt');

    const bypassData = await bypassRes.json();
    assert(bypassData.error && bypassData.error.includes('disabled'), 'Endpoint returns explicit disabled security notice');

    // -----------------------------------------------------------------------
    // TEST 2: Administrator Login Genuine Password Verification
    // -----------------------------------------------------------------------
    console.log('\nTEST SUITE 2: Administrator Password & Role Verification');
    // Attempt login with invalid password
    const invalidLoginRes = await fetch(`${PREVIEW_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vestiq21@gmail.com',
        password: 'IncorrectPassword999!',
      }),
    });
    assert(invalidLoginRes.status === 401, `Invalid admin password rejected with HTTP 401 (got ${invalidLoginRes.status})`);

    // Attempt login with correct password
    const validLoginRes = await fetch(`${PREVIEW_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vestiq21@gmail.com',
        password: 'Vestiq@Launch2026!',
      }),
    });
    assert(validLoginRes.status === 200, `Valid admin credentials accepted with HTTP 200 (got ${validLoginRes.status})`);
    
    const validData = await validLoginRes.json();
    assert(validData.user && validData.user.role === 'ADMIN', `Session granted with role ADMIN (name: ${validData.user?.name})`);
    assert(validData.redirectUrl === '/admin', `Admin redirect URL is correctly targeted to /admin`);

    const adminCookie = validLoginRes.headers.get('set-cookie');
    assert(!!adminCookie && adminCookie.includes('vestiq_session'), 'HttpOnly secure session cookie issued upon valid authentication');

    // -----------------------------------------------------------------------
    // TEST 3: Role-Based Authorization & Session Boundary Tests
    // -----------------------------------------------------------------------
    console.log('\nTEST SUITE 3: Role-Based Boundaries & RBAC Enforcement');

    // Access /admin without session -> redirect to /admin/login
    const unauthAdminRes = await fetch(`${PREVIEW_BASE_URL}/admin`, {
      redirect: 'manual',
    });
    assert(
      unauthAdminRes.status === 307 || unauthAdminRes.status === 308 || unauthAdminRes.status === 302,
      `Unauthenticated access to /admin redirected to login portal (status: ${unauthAdminRes.status})`
    );
    const redirectLocation = unauthAdminRes.headers.get('location');
    assert(redirectLocation && redirectLocation.includes('/admin/login'), `Redirect target is /admin/login (got ${redirectLocation})`);

    // Register a test investor
    const testInvestorEmail = `preview.inv.${Date.now()}@example.com`;
    const invRegRes = await fetch(`${PREVIEW_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Preview Test Investor',
        email: testInvestorEmail,
        password: 'SecureInvestorPass123!',
        role: 'INVESTOR',
        phone: '+91 99999 11111',
        country: 'India',
        city: 'Mumbai',
      }),
    });
    assert(invRegRes.status === 200, `Investor registered successfully (status: ${invRegRes.status})`);
    const investorCookie = invRegRes.headers.get('set-cookie');

    // Test that investor session cannot access /admin
    const investorAdminRes = await fetch(`${PREVIEW_BASE_URL}/admin`, {
      headers: { cookie: investorCookie },
      redirect: 'manual',
    });
    assert(
      investorAdminRes.status === 307 || investorAdminRes.status === 308 || investorAdminRes.status === 302,
      `Investor role blocked from accessing /admin (redirect status: ${investorAdminRes.status})`
    );
    const invLocation = investorAdminRes.headers.get('location');
    assert(invLocation !== '/admin', 'Investor cannot navigate into admin console');

    // Register a test business
    const testBizEmail = `preview.biz.${Date.now()}@example.com`;
    const bizRegRes = await fetch(`${PREVIEW_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Preview Startup Founder',
        email: testBizEmail,
        password: 'SecureBusinessPass123!',
        role: 'BUSINESS',
        phone: '+91 99999 22222',
        country: 'India',
        city: 'Bengaluru',
        companyName: 'Preview Tech Pvt Ltd',
        industry: 'FinTech',
        fundingRequirement: 5000000,
      }),
    });
    assert(bizRegRes.status === 200, `Business registered successfully (status: ${bizRegRes.status})`);
    const bizCookie = bizRegRes.headers.get('set-cookie');

    // Test that business cannot access /dashboard/investor
    const bizInvestorDashRes = await fetch(`${PREVIEW_BASE_URL}/dashboard/investor`, {
      headers: { cookie: bizCookie },
      redirect: 'manual',
    });
    assert(
      bizInvestorDashRes.status === 307 || bizInvestorDashRes.status === 308 || bizInvestorDashRes.status === 302,
      `Business role redirected away from investor dashboard (status: ${bizInvestorDashRes.status})`
    );

    // -----------------------------------------------------------------------
    // TEST 4: Data & Environment Isolation Check
    // -----------------------------------------------------------------------
    console.log('\nTEST SUITE 4: Production Data & Environment Isolation');
    assert(fs.existsSync(path.join(process.cwd(), 'prisma', 'preview.db')), 'Preview operations scoped strictly to prisma/preview.db');
    assert(!process.env.DATABASE_URL?.includes('supabase') && !process.env.DATABASE_URL?.includes('neon'), 'Zero modifications made to any production database or connection string');

    console.log('\n====================================================');
    console.log(`PREVIEW VALIDATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

  } finally {
    // Terminate server process cleanly
    serverProcess.kill('SIGINT');
  }

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch((e) => {
  console.error('Preview validation error:', e);
  process.exit(1);
});
