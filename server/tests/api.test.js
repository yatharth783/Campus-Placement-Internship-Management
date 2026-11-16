const assert = require('assert');
const http = require('http');
const { connectDB, disconnectDB } = require('../src/config/db');
const app = require('../src/app');
const User = require('../src/models/User');
const Job = require('../src/models/Job');

// Helper to make HTTP requests against the test server
const request = (server, options, postData) => {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Running CampusConnect Backend Comprehensive Test Suite ---');
  let server;

  try {
    await connectDB();
    server = app.listen(0); // dynamically assign available port

    // Test 1: Health Check Endpoint
    const health = await request(server, { path: '/api/health', method: 'GET' });
    assert.strictEqual(health.status, 200, 'Health endpoint should return 200');
    assert.strictEqual(health.body.status, 'healthy');
    console.log('[PASS] API health check passed!');

    // Test 2: Database Seed Verification
    const adminUser = await User.findOne({ email: 'admin@campusconnect.edu' });
    assert(adminUser, 'Default admin user must exist');
    assert.strictEqual(adminUser.role, 'admin');
    console.log('[PASS] Admin user database seed verified!');

    // Test 3: Public Job Browsing
    const jobsRes = await request(server, { path: '/api/jobs', method: 'GET' });
    assert.strictEqual(jobsRes.status, 200);
    assert(jobsRes.body.jobs.length >= 3, 'Must return at least 3 active jobs');
    console.log(`[PASS] Public jobs listing verified (${jobsRes.body.jobs.length} jobs retrieved)!`);

    // Test 4: Student Authentication & JWT
    const studentLogin = await request(server, { path: '/api/auth/login', method: 'POST' }, {
      email: 'yash.student@campusconnect.edu',
      password: 'Student@123'
    });
    assert.strictEqual(studentLogin.status, 200, 'Student login should succeed');
    assert(studentLogin.body.token, 'Should return JWT token');
    const studentToken = studentLogin.body.token;
    console.log('[PASS] Student JWT authentication passed!');

    // Test 5: Protected Student Profile Route
    const studentProfile = await request(server, {
      path: '/api/student/profile',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(studentProfile.status, 200);
    assert.strictEqual(studentProfile.body.student.email, 'yash.student@campusconnect.edu');
    console.log('[PASS] Protected student profile retrieval passed!');

    // Test 6: Role-Based Authorization Guard (Student forbidden from Admin routes)
    const unauthorizedAdminAccess = await request(server, {
      path: '/api/admin/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(unauthorizedAdminAccess.status, 403, 'Student must receive 403 Forbidden for admin routes');
    console.log('[PASS] Role-based access control guard passed (403 Forbidden enforced)!');

    // Test 7: Admin Authentication & Stats Access
    const adminLogin = await request(server, { path: '/api/auth/login', method: 'POST' }, {
      email: 'admin@campusconnect.edu',
      password: 'Admin@123'
    });
    assert.strictEqual(adminLogin.status, 200);
    const adminToken = adminLogin.body.token;

    const adminStats = await request(server, {
      path: '/api/admin/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(adminStats.status, 200);
    assert(adminStats.body.stats.totalStudents >= 1);
    assert(adminStats.body.stats.totalJobs >= 1);
    console.log('[PASS] Admin stats access and placement metrics verified!');

    // Test 8: Recruiter Authentication & Job Ownership
    const recruiterLogin = await request(server, { path: '/api/auth/login', method: 'POST' }, {
      email: 'recruiter.google@campusconnect.edu',
      password: 'Recruiter@123'
    });
    assert.strictEqual(recruiterLogin.status, 200);
    const recruiterToken = recruiterLogin.body.token;

    const recruiterJobs = await request(server, {
      path: '/api/recruiter/my-jobs',
      method: 'GET',
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    assert.strictEqual(recruiterJobs.status, 200);
    assert(Array.isArray(recruiterJobs.body.jobs));
    console.log(`[PASS] Recruiter jobs query verified (${recruiterJobs.body.jobs.length} recruiter jobs)!`);

    console.log('\n=============================================================');
    console.log('🎉 ALL BACKEND COMPREHENSIVE END-TO-END TESTS PASSED (8/8)!');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('❌ Backend test failed:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await disconnectDB();
    process.exit(0);
  }
};

runTests();
