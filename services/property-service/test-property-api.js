const http = require('http');

const BASE_URL = 'http://localhost:5002';
let createdPropertyId = null;

// Fonction pour faire des requêtes HTTP
function request(method, path, data = null) {
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
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
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

// Fonction pour attendre
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Tests
async function runTests() {
  console.log('=== DÉBUT DES TESTS DU PROPERTY SERVICE ===\n');

  try {
    // Test 1 : Health Check
    console.log('Test 1 : Health Check');
    const health = await request('GET', '/health');
    console.log(`Status: ${health.status}`);
    console.log('Response:', JSON.stringify(health.data, null, 2));
    if (health.status === 200 && health.data.succes) {
      console.log('✓ Health check réussi\n');
    } else {
      console.log('✗ Health check échoué\n');
    }
    await sleep(500);

    // Test 2 : Route racine
    console.log('Test 2 : Route racine');
    const root = await request('GET', '/');
    console.log(`Status: ${root.status}`);
    console.log('Response:', JSON.stringify(root.data, null, 2));
    if (health.status === 200) {
      console.log('✓ Route racine accessible\n');
    } else {
      console.log('✗ Route racine échouée\n');
    }
    await sleep(500);

    // Test 3 : Lister les propriétés (vide)
    console.log('Test 3 : Lister les propriétés (vide)');
    const list = await request('GET', '/api/properties');
    console.log(`Status: ${list.status}`);
    console.log('Response:', JSON.stringify(list.data, null, 2));
    if (list.status === 200) {
      console.log('✓ Liste des propriétés accessible\n');
    } else {
      console.log('✗ Liste des propriétés échouée\n');
    }
    await sleep(500);

    // Test 4 : Créer une propriété
    console.log('Test 4 : Créer une propriété');
    const newProperty = {
      nom: 'Maison Test Douala',
      type: 'maison',
      adresse: {
        rue: 'Rue Principale',
        numero: '123',
        quartier: 'Akwa',
        ville: 'Douala',
        pays: 'Cameroun'
      },
      caracteristiques: {
        chambres: 3,
        sallesDeBain: 2,
        surface: 120
      },
      loyer: 150000,
      devise: 'XAF',
      statut: 'disponible',
      bailleurId: 'test_bailleur_123'
    };
    const created = await request('POST', '/api/properties', newProperty);
    console.log(`Status: ${created.status}`);
    console.log('Response:', JSON.stringify(created.data, null, 2));
    if (created.status === 201 && created.data.succes) {
      createdPropertyId = created.data.donnees.id;
      console.log('✓ Propriété créée avec succès\n');
    } else {
      console.log('✗ Création de propriété échouée\n');
    }
    await sleep(500);

    // Test 5 : Lister les propriétés (avec la nouvelle)
    console.log('Test 5 : Lister les propriétés (après création)');
    const listAfter = await request('GET', '/api/properties');
    console.log(`Status: ${listAfter.status}`);
    console.log(`Nombre de propriétés: ${listAfter.data.nombre}`);
    if (listAfter.status === 200 && listAfter.data.nombre > 0) {
      console.log('✓ Liste des propriétés mise à jour\n');
    } else {
      console.log('✗ Liste des propriétés non mise à jour\n');
    }
    await sleep(500);

    // Test 6 : Obtenir une propriété par ID
    console.log('Test 6 : Obtenir une propriété par ID');
    if (createdPropertyId) {
      const byId = await request('GET', `/api/properties/${createdPropertyId}`);
      console.log(`Status: ${byId.status}`);
      console.log('Response:', JSON.stringify(byId.data, null, 2));
      if (byId.status === 200 && byId.data.succes) {
        console.log('✓ Propriété récupérée par ID\n');
      } else {
        console.log('✗ Récupération par ID échouée\n');
      }
    } else {
      console.log('⊗ Test ignoré (pas d\'ID de propriété)\n');
    }
    await sleep(500);

    // Test 7 : Filtrer par ville
    console.log('Test 7 : Filtrer par ville');
    const filtered = await request('GET', '/api/properties?ville=Douala');
    console.log(`Status: ${filtered.status}`);
    console.log(`Nombre de résultats: ${filtered.data.nombre}`);
    if (filtered.status === 200) {
      console.log('✓ Filtre par ville fonctionne\n');
    } else {
      console.log('✗ Filtre par ville échoué\n');
    }
    await sleep(500);

    // Test 8 : Mettre à jour une propriété
    console.log('Test 8 : Mettre à jour une propriété');
    if (createdPropertyId) {
      const updated = await request('PUT', `/api/properties/${createdPropertyId}`, {
        loyer: 180000,
        description: 'Maison magnifique avec vue sur mer'
      });
      console.log(`Status: ${updated.status}`);
      console.log('Response:', JSON.stringify(updated.data, null, 2));
      if (updated.status === 200 && updated.data.succes) {
        console.log('✓ Propriété mise à jour\n');
      } else {
        console.log('✗ Mise à jour échouée\n');
      }
    } else {
      console.log('⊗ Test ignoré (pas d\'ID de propriété)\n');
    }
    await sleep(500);

    // Test 9 : Changer le statut
    console.log('Test 9 : Changer le statut');
    if (createdPropertyId) {
      const statusChange = await request('PUT', `/api/properties/${createdPropertyId}/statut`, {
        statut: 'occupee'
      });
      console.log(`Status: ${statusChange.status}`);
      console.log('Response:', JSON.stringify(statusChange.data, null, 2));
      if (statusChange.status === 200 && statusChange.data.succes) {
        console.log('✓ Statut changé avec succès\n');
      } else {
        console.log('✗ Changement de statut échoué\n');
      }
    } else {
      console.log('⊗ Test ignoré (pas d\'ID de propriété)\n');
    }
    await sleep(500);

    // Test 10 : Ajouter une photo
    console.log('Test 10 : Ajouter une photo');
    if (createdPropertyId) {
      const photo = await request('POST', `/api/properties/${createdPropertyId}/photos`, {
        url: 'https://example.com/photo.jpg',
        description: 'Vue de la maison'
      });
      console.log(`Status: ${photo.status}`);
      console.log('Response:', JSON.stringify(photo.data, null, 2));
      if (photo.status === 200 && photo.data.succes) {
        console.log('✓ Photo ajoutée avec succès\n');
      } else {
        console.log('✗ Ajout de photo échoué\n');
      }
    } else {
      console.log('⊗ Test ignoré (pas d\'ID de propriété)\n');
    }
    await sleep(500);

    // Test 11 : Obtenir les statistiques d'un bailleur
    console.log('Test 11 : Obtenir les statistiques d\'un bailleur');
    const stats = await request('GET', '/api/properties/statistiques/bailleur/test_bailleur_123');
    console.log(`Status: ${stats.status}`);
    console.log('Response:', JSON.stringify(stats.data, null, 2));
    if (stats.status === 200 && stats.data.succes) {
      console.log('✓ Statistiques récupérées\n');
    } else {
      console.log('✗ Récupération des statistiques échouée\n');
    }
    await sleep(500);

    // Test 12 : Supprimer une propriété
    console.log('Test 12 : Supprimer une propriété');
    if (createdPropertyId) {
      const deleted = await request('DELETE', `/api/properties/${createdPropertyId}`);
      console.log(`Status: ${deleted.status}`);
      console.log('Response:', JSON.stringify(deleted.data, null, 2));
      if (deleted.status === 200 && deleted.data.succes) {
        console.log('✓ Propriété supprimée (désactivée)\n');
      } else {
        console.log('✗ Suppression échouée\n');
      }
    } else {
      console.log('⊗ Test ignoré (pas d\'ID de propriété)\n');
    }
    await sleep(500);

    // Test 13 : Propriété non trouvée
    console.log('Test 13 : Propriété non trouvée');
    const notFound = await request('GET', '/api/properties/id_inexistant');
    console.log(`Status: ${notFound.status}`);
    console.log('Response:', JSON.stringify(notFound.data, null, 2));
    if (notFound.status === 404) {
      console.log('✓ Gestion des erreurs 404 correcte\n');
    } else {
      console.log('✗ Gestion des erreurs 404 incorrecte\n');
    }

    console.log('=== TOUS LES TESTS SONT TERMINÉS ===');

  } catch (error) {
    console.error('Erreur lors des tests:', error.message);
    console.log('\nAssurez-vous que le serveur est démarré avec: npm run dev');
  }
}

// Attendre que le serveur démarre
console.log('Attente du démarrage du serveur...');
setTimeout(() => {
  runTests();
}, 2000);
