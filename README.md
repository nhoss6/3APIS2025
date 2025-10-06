

---

# Récapitulatif général : Développement backend avec Node.js et Express

---

## 1. Introduction à Node.js

Node.js est un environnement d’exécution JavaScript côté serveur, basé sur le moteur **V8 de Google Chrome**.
Il permet d’exécuter du JavaScript sans navigateur, directement sur une machine serveur.

### Principes fondamentaux :

* Modèle **asynchrone** et **non bloquant** : les opérations réseau ou fichiers ne bloquent pas le programme.
* Fonctionne sur une **boucle d’événements (event loop)**.
* Idéal pour les applications **temps réel** : chat, jeux, API, dashboards, etc.

### Avantages :

* Rapide et léger.
* Un seul langage pour front-end et back-end.
* Écosystème très riche via **npm (Node Package Manager)**.

---

## 2. npm : Node Package Manager

npm permet d’installer, gérer et mettre à jour les dépendances nécessaires à un projet Node.js.

### Commandes utiles :

```bash
npm init               # Initialise un projet (crée package.json)
npm install express    # Installe Express
npm install --save-dev jest  # Installe une dépendance de développement
npm start              # Exécute le script 'start'
npm test               # Exécute le script 'test'
```

### Le fichier `package.json` contient :

* Les métadonnées du projet (`name`, `version`, `description`)
* Les dépendances (`dependencies`)
* Les dépendances de développement (`devDependencies`)
* Les scripts (`start`, `test`, etc.)

---

## 3. Express.js : Framework minimaliste pour Node.js

Express est un framework qui simplifie la création de serveurs HTTP et d’APIs REST.

### Points forts :

* Gestion simple des routes.
* Support des middlewares.
* Compatibilité avec des moteurs de vues (EJS, Pug).
* Très modulaire et extensible.

### Installation :

```bash
npm install express
```

---

## 4. Structure type d’un projet Express

```
myapp/
│
├── app.js              → Fichier principal Express
├── package.json        → Dépendances et scripts npm
├── /routes             → Fichiers de routes (index.js, users.js, articles.js…)
├── /views              → Templates (Pug, EJS…)
├── /public             → Fichiers statiques (CSS, JS, images)
└── /bin/www            → Script de démarrage du serveur
```

---

## 5. Routage (Routing)

Le routage permet de définir les endpoints de l’application et la logique associée.

### Exemple :

```js
app.get('/', (req, res) => res.send('Accueil'));
app.post('/users', (req, res) => res.json({ message: 'Utilisateur créé' }));
app.put('/users/:id', (req, res) => res.json({ message: 'Utilisateur modifié' }));
app.delete('/users/:id', (req, res) => res.json({ message: 'Utilisateur supprimé' }));
```

| Méthode HTTP | Rôle      | Exemple d’utilisation  |
| ------------ | --------- | ---------------------- |
| GET          | Lire      | `GET /articles`        |
| POST         | Créer     | `POST /articles`       |
| PUT / PATCH  | Modifier  | `PUT /articles/:id`    |
| DELETE       | Supprimer | `DELETE /articles/:id` |

---

## 6. Les middlewares

Un **middleware** est une fonction exécutée avant la réponse finale.
Il peut modifier la requête, vérifier des conditions ou ajouter des informations.

### Exemple :

```js
app.use((req, res, next) => {
  console.log(`Requête : ${req.method} ${req.url}`);
  next(); // Passe au middleware suivant
});
```

### Exemples de middlewares :

* `express.json()` : lire le corps des requêtes JSON.
* `express.static()` : servir des fichiers statiques.
* Authentification JWT.
* Journalisation des requêtes (logger).
* Gestion des erreurs.

---

## 7. Gestion des erreurs

Express permet d’intercepter et de gérer les erreurs globalement.

### Exemple :

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});
```

### Gestion des routes inexistantes :

```js
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});
```

---

## 8. Les codes HTTP les plus utilisés

| Code                          | Signification           | Quand l’utiliser                 |
| ----------------------------- | ----------------------- | -------------------------------- |
| **200 OK**                    | Requête réussie         | Réponse à une requête GET, PUT   |
| **201 Created**               | Ressource créée         | Réponse à un POST réussi         |
| **204 No Content**            | Pas de contenu retourné | Suppression réussie (DELETE)     |
| **400 Bad Request**           | Données invalides       | Mauvais corps de requête         |
| **401 Unauthorized**          | Non authentifié         | Absence ou invalidité du token   |
| **403 Forbidden**             | Non autorisé            | L’utilisateur n’a pas les droits |
| **404 Not Found**             | Ressource inexistante   | ID ou route incorrecte           |
| **500 Internal Server Error** | Erreur serveur          | Exception non gérée              |

---

## 9. Tester son API avec Postman

Postman est un outil pour tester les endpoints d’une API sans interface graphique.

### Exemple : créer un article

**Méthode :** POST
**URL :** `http://localhost:3000/articles`
**Headers :**

```
Content-Type: application/json
```

**Body (JSON) :**

```json
{
  "name": "Laptop",
  "price": 1200,
  "stock": 10
}
```

**Réponse attendue (code 201) :**

```json
{
  "id": 1,
  "name": "Laptop",
  "price": 1200,
  "stock": 10
}
```

### Exemple : récupérer un article

**Méthode :** GET
**URL :** `http://localhost:3000/articles/1`

**Réponse (code 200) :**

```json
{
  "id": 1,
  "name": "Laptop",
  "price": 1200,
  "stock": 10
}
```

---

## 10. CRUD complet (en mémoire)

```js
let articles = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Headphones", price: 199 }
];

// CREATE
app.post('/articles', (req, res) => { ... });

// READ
app.get('/articles', (req, res) => { ... });
app.get('/articles/:id', (req, res) => { ... });

// UPDATE
app.put('/articles/:id', (req, res) => { ... });

// DELETE
app.delete('/articles/:id', (req, res) => { ... });
```

Les données sont **stockées en mémoire** : elles disparaissent au redémarrage du serveur.

---

## 11. Route globale et compteur de visites

```js
let hits = {};

app.use((req, res, next) => {
  hits[req.url] = (hits[req.url] || 0) + 1;
  next();
});

app.get('/hits', (req, res) => {
  res.json(hits);
});
```

Chaque requête augmente un compteur selon l’URL visitée.

---

## 12. API e-commerce (exemple pratique)

### Objectif :

Créer une API permettant :

* Le CRUD complet sur les articles
* La gestion d’un panier
* Le paiement simulé (checkout)

### Endpoints :

| Méthode | URL              | Description              |
| ------- | ---------------- | ------------------------ |
| GET     | `/articles`      | Lister tous les articles |
| POST    | `/articles`      | Ajouter un article       |
| GET     | `/articles/:id`  | Voir un article          |
| DELETE  | `/articles/:id`  | Supprimer un article     |
| POST    | `/cart`          | Ajouter au panier        |
| GET     | `/cart`          | Voir le panier           |
| POST    | `/cart/checkout` | Simuler un paiement      |

---

## 13. Tests unitaires (Jest + Supertest)

### Installation :

```bash
npm install --save-dev jest supertest
```

### Exemple de test :

```js
const request = require("supertest");
const app = require("../app");

test("GET /articles retourne 200", async () => {
  const res = await request(app).get("/articles");
  expect(res.statusCode).toBe(200);
});
```

### Lancer les tests :

```bash
npm test
```

---

## 14. Bonnes pratiques API REST

* Respecter les **conventions HTTP** (GET, POST, PUT, DELETE).
* Utiliser les bons **codes de statut HTTP**.
* Retourner toujours du **JSON structuré**.
* Documenter les routes (via Swagger/OpenAPI).
* Gérer les erreurs et les cas limites.
* Tester régulièrement avec **Postman ou Jest**.
* Ne jamais stocker d’informations sensibles en clair.

---

## 15. Synthèse : points essentiels

* Node.js exécute JavaScript côté serveur.
* Express simplifie la création d’API REST.
* Les middlewares centralisent les traitements communs.
* Le CRUD constitue la base de toute API.
* Les routes et codes HTTP doivent suivre des standards.
* Les tests assurent la fiabilité du code.
* Postman est l’outil de référence pour tester une API manuellement.
* Toujours structurer et documenter son projet.

---

