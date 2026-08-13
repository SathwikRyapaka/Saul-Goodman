const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

const tests = [
  { user: 'laxmi@nyayasetu.test', pass: 'Laxmi@12345', query: 'OS/545/2023', expect: 'ALLOW' },
  { user: 'laxmi@nyayasetu.test', pass: 'Laxmi@12345', query: 'OS/943/2022', expect: 'DENY' },
  { user: 'srinivas@nyayasetu.test', pass: 'Srinivas@12345', query: 'OS/943/2022', expect: 'ALLOW' },
  { user: 'srinivas@nyayasetu.test', pass: 'Srinivas@12345', query: 'OS/545/2023', expect: 'DENY' },
  { user: 'raghavendra@nyayasetu.test', pass: 'Raghavendra@12345', query: 'OS/152/2024', expect: 'ALLOW' },
  { user: 'raghavendra@nyayasetu.test', pass: 'Raghavendra@12345', query: 'OS/545/2023', expect: 'DENY' },
];

async function runTests() {
  for (const t of tests) {
    try {
      // Login
      const loginRes = await axios.post(`${API_URL}/auth/login`, { email: t.user, password: t.pass });
      const token = loginRes.data.accessToken;
      
      // Search
      const searchRes = await axios.get(`${API_URL}/cases/search?q=${t.query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const foundCount = searchRes.data.count;
      const result = foundCount > 0 ? 'ALLOW' : 'DENY';
      
      const status = result === t.expect ? '✅ PASS' : '❌ FAIL';
      console.log(`[${status}] User: ${t.user} | Search: ${t.query} | Expected: ${t.expect} | Got: ${result}`);
      
    } catch (err) {
      console.error(`Error on ${t.user}:`, err.response?.data || err.message);
    }
  }
}

runTests();
