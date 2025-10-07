

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


# README — Express + MongoDB Atlas (Mongoose) de A à Z

Ce guide pas à pas part de zéro et mène jusqu’à une API CRUD fonctionnelle avec Express, connectée à MongoDB Atlas via Mongoose. Il est destiné à un débutant. Les explications accompagnent chaque étape.

---

## 1) Prérequis

* Node.js 18+ installé (`node -v`, `npm -v`)
* Un terminal (Windows CMD/PowerShell ou macOS/Linux)
* Un compte MongoDB Atlas et MongoDB Compass installés

---

## 2) Créer le projet Express

### 2.1 Installer le générateur (si besoin)

```bash
npm i -g express-generator
```

### 2.2 Générer l’application

```bash
express myapp
cd myapp
npm install
```

Le générateur crée la structure standard avec `bin/www`, `app.js`, `routes`, `views`, etc.

---

## 3) Installer les dépendances pour MongoDB

Dans le dossier `myapp` :

```bash
npm install mongoose dotenv
```

* `mongoose` : ODM pour manipuler MongoDB depuis Node.js
* `dotenv` : charge les variables d’environnement depuis un fichier `.env`

---

## 4) Créer la base MongoDB sur Atlas

1. Connectez-vous à [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Créez un cluster gratuit (M0).
3. Dans **Network Access** : ajoutez votre IP (ou 0.0.0.0/0 pour des tests, à éviter en production).
4. Dans **Database Access** : créez un utilisateur avec mot de passe.
5. Cliquez sur **Connect** → **Drivers** et copiez l’URI, de la forme :

   ```
   mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/
   ```

> Important : précisez la base directement dans l’URI (ex. `ecommerceDB`) à la fin à l’étape suivante.

---

## 5) Configurer les variables d’environnement

Créez un fichier `.env` à l’intérieur de `myapp/` :

```
PORT=3000
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/ecommerceDB?retryWrites=true&w=majority
```

Remplacez `<USER>`, `<PASSWORD>` et `<CLUSTER>` par vos valeurs Atlas.
Le segment `/ecommerceDB` définit la base utilisée.

> Ne commitez jamais `.env` dans un dépôt public.

---

## 6) Connecter Express à MongoDB (Mongoose)

### 6.1 Créer `myapp/db.js`

```js
// myapp/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
console.log("Mongoose URI =", uri); // utile pour diagnostiquer

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
```

### 6.2 Appeler la connexion dans `myapp/app.js`

Ouvrez `app.js` et ajoutez la connexion en haut :

```js
const connectDB = require('./db');
connectDB();
```

---

## 7) Définir un modèle Mongoose

Créez le dossier `myapp/models` puis `myapp/models/Product.js` :

```js
// myapp/models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0 },
    tags:  [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
```

---

## 8) Créer les routes CRUD

Créez `myapp/routes/products.js` :

```js
// myapp/routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// CREATE
router.post("/", async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get("/", async (_req, res) => {
  try {
    const list = await Product.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

module.exports = router;
```

Montez le routeur dans `myapp/app.js` :

```js
const productsRouter = require("./routes/products");
app.use("/products", productsRouter);
```

Supprimez toute route locale `/products` redondante éventuellement ajoutée dans `app.js`, pour éviter les doublons.

---

## 9) Scripts NPM utiles

Dans `myapp/package.json`, assurez-vous d’avoir un script de démarrage :

```json
{
  "scripts": {
    "start": "node ./bin/www"
  }
}
```

---

## 10) Lancer le serveur

Dans un terminal, depuis le dossier `myapp` :

```bash
npm start
```

Vous devez voir dans la console :

```
Mongoose URI = mongodb+srv://...
Connected to MongoDB Atlas
Server listening on port 3000
```

---

## 11) Tester l’API

### 11.1 Avec curl

Sous Windows, les commandes doivent tenir sur une seule ligne, et les guillemets dans le JSON doivent être échappés.

* Créer un produit

```bash
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d "{\"name\":\"Keyboard\",\"price\":49.9,\"stock\":100,\"tags\":[\"usb\",\"peripheral\"]}"
```

* Lister tous les produits

```bash
curl http://localhost:3000/products
```

* Récupérer un produit (remplacer `<id>`)

```bash
curl http://localhost:3000/products/<id>
```

* Mettre à jour un produit (remplacer `<id>`)

```bash
curl -X PATCH http://localhost:3000/products/<id> -H "Content-Type: application/json" -d "{\"price\":59.9}"
```

* Supprimer un produit (remplacer `<id>`)

```bash
curl -X DELETE http://localhost:3000/products/<id>
```

### 11.2 Avec Postman (recommandé)

* POST `http://localhost:3000/products`
  Body → raw → JSON :

  ```json
  { "name": "Headset", "price": 79.9, "stock": 50, "tags": ["audio","usb"] }
  ```
* GET `http://localhost:3000/products`
* GET `http://localhost:3000/products/<id>`
* PATCH `http://localhost:3000/products/<id>`
* DELETE `http://localhost:3000/products/<id>`

---

## 12) Vérifier les données dans Compass

1. Ouvrez MongoDB Compass.
2. Connectez-vous avec la même URI Atlas.
3. Ouvrez la base `ecommerceDB`.
4. Ouvrez la collection `products`.
5. Rafraîchissez la vue si nécessaire. Vous devez voir vos documents insérés par l’API.

---

## 13) Structure finale du projet

```
myapp/
├─ .env
├─ app.js
├─ bin/
│  └─ www
├─ db.js
├─ models/
│  └─ Product.js
├─ routes/
│  ├─ index.js
│  └─ products.js
├─ package.json
└─ ...
```

---

## 14) Dépannage courant

1. `The uri parameter to openUri() must be a string, got "undefined"`
   Cause : `process.env.MONGODB_URI` introuvable.
   Solutions :

* Fichier `.env` bien placé dans `myapp/` et chargé avec `require("dotenv").config();`
* Lancer depuis le dossier `myapp`
* Vérifier la variable `MONGODB_URI` et le nom de base (ex. `/ecommerceDB?...`)

2. `ECONNREFUSED localhost:3000` lors d’un curl
   Cause : serveur non démarré ou mauvais port.
   Solutions :

* Lancer `npm start`
* Vérifier que le terminal affiche “Server listening on port 3000”
* Vérifier `PORT=3000` dans `.env`

3. `IP not whitelisted` sur Atlas
   Cause : IP non autorisée.
   Solution : dans Atlas, **Network Access** → whitelister votre IP (ou 0.0.0.0/0 pour tests).

4. Avertissements `useNewUrlParser` et `useUnifiedTopology`
   Cause : options obsolètes pour Mongoose 8+.
   Solution : ne pas fournir ces options, comme dans l’exemple.

5. Vous ne voyez pas les documents dans Compass
   Causes possibles :

* La base affichée dans Compass n’est pas celle de l’URI (ex. vous regardez `ecommerceDB` alors que l’URI écrit dans `test`).
* La collection n’existe pas encore. Insérez un premier document via l’API pour la créer.
  Solutions :
* Mettre la base dans l’URI de `.env` (ex. `/ecommerceDB?...`)
* Rafraîchir la vue dans Compass.

6. `Cannot DELETE /products`
   Cause : la route DELETE attend un id (`/products/:id`) et non `/products`.
   Solution :

```bash
curl -X DELETE http://localhost:3000/products/<id>
```

7. Conflit de routes `/products`
   Cause : doublon entre les routes définies dans `app.js` et celles du routeur `routes/products.js`.
   Solution : centraliser les routes CRUD dans `routes/products.js` uniquement et monter le routeur via `app.use('/products', productsRouter)`.

---

## 15) Aller plus loin (optionnel)

* Fichier de seed (`scripts/seed.js`) pour insérer des données de démo.
* Validation plus stricte du schéma (ex. `unique: true` sur `name`).
* Pagination, tri, filtres dans `GET /products` via query string.
* Tests automatisés avec Jest ou supertest.
* Sécurisation (rate limiting, CORS selon besoin, variables d’environnement par environnement).

---

## 16) Licence et sécurité

* Ne commitez jamais votre fichier `.env` ou vos identifiants MongoDB.
* Utilisez des utilisateurs Atlas dédiés avec droits minimums nécessaires.
* Pour un dépôt public, mettez un `.gitignore` qui inclut `.env`.

---

