async function runTests() {
  const baseUrl = 'http://127.0.0.1:8787/api/auth';
  let results = '# Local Authentication Testing Results\n\n';

  const testCases = [
    {
      name: 'Test 1: Weak Password (Should Fail)',
      url: `${baseUrl}/register`,
      payload: {
        email: 'weak@nexmart.in',
        fullName: 'Test User',
        password: 'weakpassword',
        confirmPassword: 'weakpassword'
      }
    },
    {
      name: 'Test 2: Passwords Do Not Match (Should Fail)',
      url: `${baseUrl}/register`,
      payload: {
        email: 'nomatch@nexmart.in',
        fullName: 'Test User',
        password: 'Str0ngP@ssw0rd!',
        confirmPassword: 'WrongPassword!'
      }
    },
    {
      name: 'Test 3: Strong Password & Match (Should Succeed)',
      url: `${baseUrl}/register`,
      payload: {
        email: 'success@nexmart.in',
        fullName: 'Aman Shekar',
        password: 'Str0ngP@ssw0rd!',
        confirmPassword: 'Str0ngP@ssw0rd!'
      }
    },
    {
      name: 'Test 4: Login with newly created user (Should Succeed)',
      url: `${baseUrl}/login`,
      payload: {
        email: 'success@nexmart.in',
        password: 'Str0ngP@ssw0rd!'
      }
    }
  ];

  for (const test of testCases) {
    results += `## ${test.name}\n`;
    results += `**Payload:**\n\`\`\`json\n${JSON.stringify(test.payload, null, 2)}\n\`\`\`\n\n`;
    try {
      const response = await fetch(test.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.payload)
      });
      const data = await response.json();
      results += `**Status Code:** ${response.status}\n`;
      results += `**Response:**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n`;
    } catch (e) {
      results += `**Error:** ${e.message}\n\n`;
    }
    results += `---\n\n`;
  }

  const fs = require('fs');
  fs.writeFileSync('auth_test_results.md', results);
  console.log('Done testing!');
}

runTests();
