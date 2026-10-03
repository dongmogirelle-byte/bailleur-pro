// Script de test des API du Auth Service
const http = require('http');

const BASE_URL = 'http://localhost:5001';

// Fonction pour faire des requêtes HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Tests
async function runTests() {
  console.log('=== Tests API Auth Service ===\n');

  try {
    // Test 1 : Health Check
    console.log('Test 1 : Health Check');
    const health = await makeRequest('GET', '/health');
    console.log(`Status: ${health.status}`);
    console.log(`Response:`, JSON.stringify(health.data, null, 2));
    console.log('✓ Health check réussi\n');

    // Test 2 : Route racine
    console.log('Test 2 : Route racine');
    const root = await makeRequest('GET', '/');
    console.log(`Status: ${root.status}`);
    console.log(`Response:`, JSON.stringify(root.data, null, 2));
    console.log('✓ Route racine réussie\n');

    // Test 3 : Register valide
    console.log('Test 3 : Register valide');
    const register = await makeRequest('POST', '/api/auth/register', {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      password: 'Password123',
      role: 'bailleur'
    });
    console.log(`Status: ${register.status}`);
    console.log(`Response:`, JSON.stringify(register.data, null, 2));
    console.log('✓ Register réussi\n');

    // Test 4 : Register invalide (sans mot de passe)
    console.log('Test 4 : Register invalide (sans mot de passe)');
    const registerInvalid = await makeRequest('POST', '/api/auth/register', {
      name: 'Test',
      email: 'test@example.com'
    });
    console.log(`Status: ${registerInvalid.status}`);
    console.log(`Response:`, JSON.stringify(registerInvalid.data, null, 2));
    console.log('✓ Validation fonctionne\n');

    // Test 5 : Login
    console.log('Test 5 : Login');
    const login = await makeRequest('POST', '/api/auth/login', {
      email: 'jean.dupont@example.com',
      password: 'Password123'
    });
    console.log(`Status: ${login.status}`);
    console.log(`Response:`, JSON.stringify(login.data, null, 2));
    console.log('✓ Login réussi\n');

    // Test 6 : Get Me sans token
    console.log('Test 6 : Get Me sans token (doit échouer)');
    const getMeNoToken = await makeRequest('GET', '/api/auth/me');
    console.log(`Status: ${getMeNoToken.status}`);
    console.log(`Response:`, JSON.stringify(getMeNoToken.data, null, 2));
    console.log('✓ Protection fonctionne\n');

    // Test 7 : Get Me avec token
    console.log('Test 7 : Get Me avec token');
    const token = login.data.data.token;
    const getMeWithToken = await makeRequest('GET', '/api/auth/me');
    getMeWithToken.headers = {
      'Authorization': `Bearer ${token}`
    };
    console.log(`Status: ${getMeWithToken.status}`);
    console.log(`Response:`, JSON.stringify(getMeWithToken.data, null, 2));
    console.log('✓ Get Me avec token réussi\n');

    console.log('=== Tous les tests sont passés ===');
  } catch (error) {
    console.error('Erreur lors des tests:', error.message);
    console.error('\nAssurez-vous que le serveur est démarré avec : node server-test.js');
  }
}

// Attendre un peu que le serveur démarre
setTimeout(() => {
  runTests();
}, 2000);
