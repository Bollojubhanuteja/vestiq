/**
 * End-to-End HTTP Route Verification Script
 */

async function runE2E() {
  const baseUrl = 'http://localhost:3000';
  console.log(`--- Running E2E Verification against ${baseUrl} ---`);

  const publicRoutes = [
    '/',
    '/explore',
    '/how-it-works',
    '/for-investors',
    '/for-businesses',
    '/about',
    '/faq',
    '/contact',
    '/login',
    '/register',
    '/privacy',
    '/terms',
    '/risk-disclosure',
    '/robots.txt',
    '/sitemap.xml',
  ];

  let passed = 0;
  let failed = 0;

  for (const route of publicRoutes) {
    try {
      const res = await fetch(`${baseUrl}${route}`);
      if (res.status === 200) {
        console.log(`[PASS] ${route} -> Status 200 OK`);
        passed++;
      } else {
        console.error(`[FAIL] ${route} -> Status ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`[FAIL] ${route} -> Connection Error:`, err.message);
      failed++;
    }
  }

  // Test API: opportunities
  try {
    const oppRes = await fetch(`${baseUrl}/api/opportunities`);
    if (oppRes.status === 200) {
      const oppData = await oppRes.json();
      console.log(`[PASS] /api/opportunities -> Status 200 OK (${oppData.opportunities?.length || 0} active opportunities returned)`);
      passed++;
    } else {
      console.error(`[FAIL] /api/opportunities -> Status ${oppRes.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`[FAIL] /api/opportunities ->`, err.message);
    failed++;
  }

  // Test API: Investor Login & Session Cookie
  let sessionCookie = '';
  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'investor@vestiq.com', password: 'Password123!' }),
    });

    if (loginRes.status === 200) {
      const loginData = await loginRes.json();
      const rawCookie = loginRes.headers.get('set-cookie');
      if (rawCookie) {
        sessionCookie = rawCookie.split(';')[0];
      }
      console.log(`[PASS] /api/auth/login (Investor) -> Status 200 OK (User: ${loginData.user.name})`);
      passed++;
    } else {
      console.error(`[FAIL] /api/auth/login -> Status ${loginRes.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`[FAIL] /api/auth/login ->`, err.message);
    failed++;
  }

  // Test Protected Investor API with cookie
  if (sessionCookie) {
    try {
      const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Cookie: sessionCookie },
      });
      if (meRes.status === 200) {
        const meData = await meRes.json();
        console.log(`[PASS] /api/auth/me (Protected Session) -> Status 200 OK (Authenticated as ${meData.user.role})`);
        passed++;
      } else {
        console.error(`[FAIL] /api/auth/me -> Status ${meRes.status}`);
        failed++;
      }

      const wlRes = await fetch(`${baseUrl}/api/investor/watchlist`, {
        headers: { Cookie: sessionCookie },
      });
      if (wlRes.status === 200) {
        const wlData = await wlRes.json();
        console.log(`[PASS] /api/investor/watchlist (Protected) -> Status 200 OK (${wlData.watchlist?.length || 0} saved items)`);
        passed++;
      } else {
        console.error(`[FAIL] /api/investor/watchlist -> Status ${wlRes.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`[FAIL] Protected API test ->`, err.message);
      failed++;
    }
  }

  // Test Admin Login & Protected Route
  try {
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vestiq.com', password: 'Password123!' }),
    });

    if (adminLoginRes.status === 200) {
      const rawAdminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0];
      const metricsRes = await fetch(`${baseUrl}/api/admin/metrics`, {
        headers: { Cookie: rawAdminCookie },
      });

      if (metricsRes.status === 200) {
        const m = await metricsRes.json();
        console.log(`[PASS] /api/admin/metrics (Admin RBAC) -> Status 200 OK (Investors: ${m.metrics.totalInvestors}, Businesses: ${m.metrics.totalBusinesses}, Approved: ${m.metrics.approvedOpportunities})`);
        passed++;
      } else {
        console.error(`[FAIL] /api/admin/metrics -> Status ${metricsRes.status}`);
        failed++;
      }
    }
  } catch (err) {
    console.error(`[FAIL] Admin test ->`, err.message);
    failed++;
  }

  console.log(`\n====================================================`);
  console.log(`E2E SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`====================================================`);

  if (failed > 0) process.exit(1);
  else process.exit(0);
}

// Give server 3 seconds to spin up if just launched
setTimeout(runE2E, 2500);
