

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

Voici un **tuto pas à pas, prêt à copier dans ton README**, pour guider un débutant sur les **tests d’une API Express + MongoDB** et la **validation des données**.
Tout est expliqué, avec fichiers, commandes et exemples.

---

# Tests et validation de l’API (Express + MongoDB)

Ce guide montre comment :

1. Installer et configurer les outils de test
2. Écrire des tests unitaires, modèle Mongoose, et d’intégration API
3. Mesurer la couverture avec `c8`
4. Valider les données entrantes (Joi) et tester les erreurs

> Règle clé : *Ne jamais faire confiance aux données externes.*
> Toute requête doit être validée avant traitement ou insertion en base.

---

## 0) Prérequis

* Projet Express fonctionnel, connecté à MongoDB Atlas
* Node.js 18+
* `package.json` en ES Modules (contient `"type": "module"`)

---

## 1) Installer les dépendances de test et de validation

```bash
npm i -D mocha chai supertest c8
npm i joi
```

* **mocha** : framework de test
* **chai** : assertions
* **supertest** : tests d’intégration HTTP sur `app`
* **c8** : couverture ESM (remplace nyc)
* **joi** : validation des entrées

---

## 2) Configurer les scripts npm

Dans `package.json` :

```json
{
  "type": "module",
  "scripts": {
    "start": "node ./bin/www",
    "test": "mocha --timeout 5000",
    "coverage": "c8 --reporter=text --reporter=html npm test"
  },
  "c8": {
    "exclude": ["test/**", "bin/**", "db.js", "app.js", "node_modules/**"],
    "include": ["models/**", "routes/**", "utils/**"],
    "reporter": ["text", "html"]
  }
}
```

* `npm test` lance tous les tests
* `npm run coverage` génère un rapport texte + HTML (`coverage/index.html`)
* La config `c8` ignore les fichiers non pertinents (tests, bootstrap, etc.)

---

## 3) Arborescence conseillée

```
myapp/
  models/
    Product.js
  routes/
    products.js
  utils/
    productUtils.js
  validators/
    productValidator.js
  test/
    product.test.js           ← test unitaire (utils)
    model.product.test.js     ← test modèle Mongoose
    api.products.test.js      ← test intégration API
  app.js
  db.js
  .env
```

---

## 4) Test unitaire (fonction utilitaire)

### 4.1 Code à tester : `utils/productUtils.js`

```js
// utils/productUtils.js
export function calculateDiscountedPrice(price, discount) {
  if (typeof price !== "number" || typeof discount !== "number") {
    throw new Error("Les valeurs doivent être numériques");
  }
  if (price < 0 || discount < 0) {
    throw new Error("Les valeurs ne peuvent pas être négatives");
  }
  return price - (price * discount) / 100;
}
```

### 4.2 Test : `test/product.test.js`

```js
// test/product.test.js
import { expect } from "chai";
import { calculateDiscountedPrice } from "../utils/productUtils.js";

describe("calculateDiscountedPrice", function () {
  it("calcule correctement une réduction de 20%", function () {
    const result = calculateDiscountedPrice(100, 20);
    expect(result).to.equal(80);
  });

  it("lève une erreur si les valeurs ne sont pas numériques", function () {
    expect(() => calculateDiscountedPrice("100", 20)).to.throw();
  });
});
```

**Pourquoi** : test rapide d’une petite logique métier, isolée de la base de données.

---

## 5) Validation des données côté API (Joi)

### 5.1 Schéma de validation : `validators/productValidator.js`

```js
// validators/productValidator.js
import Joi from "joi";

export const productSchema = Joi.object({
  name:  Joi.string().min(2).max(50).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).default(0),
  tags:  Joi.array().items(Joi.string()).default([])
});
```

### 5.2 Application dans la route : `routes/products.js`

> Exemple minimal montrant la validation en `POST` et `PATCH`.

```js
// routes/products.js
import express from "express";
import Product from "../models/Product.js";
import { productSchema } from "../validators/productValidator.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const created = await Product.create(value);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// READ all
router.get("/", async (_req, res) => {
  const list = await Product.find();
  res.json(list);
});

// READ one
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body, { allowUnknown: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Product.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: `Product ${deleted.name} deleted successfully` });
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

export default router;
```

**Pourquoi** : on bloque tôt les requêtes invalides (400) pour protéger la base et rendre l’API prévisible.

---

## 6) Tester le modèle Mongoose (CRUD)

`test/model.product.test.js` :

```js
import mongoose from "mongoose";
import { expect } from "chai";
import Product from "../models/Product.js";

describe("MongoDB Product model", function () {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async function () {
    await Product.deleteMany({});
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("crée et retrouve un produit", async function () {
    const p = await Product.create({ name: "Mouse", price: 19.9, stock: 30 });
    const found = await Product.findOne({ name: "Mouse" });
    expect(found).to.exist;
    expect(found.price).to.equal(19.9);
  });
});
```

**Pourquoi** : vérifier que le schéma, les contraintes et les opérations MongoDB fonctionnent.

---

## 7) Tests d’intégration API (Supertest)

`test/api.products.test.js` :

```js
import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../app.js";             // importer l'app, pas besoin de lancer bin/www
import Product from "../models/Product.js";

describe("API /products", function () {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async function () {
    await Product.deleteMany({});
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("POST /products - refuse des données invalides", async function () {
    const res = await request(app)
      .post("/products")
      .send({ name: "K" })               // invalide: trop court et pas de price
      .expect(400);
    expect(res.body.message).to.include("price");
  });

  it("POST /products - crée un produit valide", async function () {
    const res = await request(app)
      .post("/products")
      .send({ name: "Monitor", price: 199.9, stock: 50, tags: ["hdmi"] })
      .expect(201);
    expect(res.body).to.have.property("_id");
  });

  it("GET /products - retourne la liste", async function () {
    await Product.create({ name: "Keyboard", price: 49.9 });
    const res = await request(app).get("/products").expect(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
  });

  it("GET /products/:id - 404 si id inconnu", async function () {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/products/${fakeId}`).expect(404);
    expect(res.body.message).to.include("not found");
  });

  it("PATCH /products/:id - met à jour un produit", async function () {
    const p = await Product.create({ name: "Headset", price: 79.9 });
    const res = await request(app)
      .patch(`/products/${p._id}`)
      .send({ price: 89.9 })
      .expect(200);
    expect(res.body.price).to.equal(89.9);
  });

  it("DELETE /products/:id - supprime un produit", async function () {
    const p = await Product.create({ name: "Mouse", price: 29.9 });
    const res = await request(app).delete(`/products/${p._id}`).expect(200);
    expect(res.body.message).to.include("deleted");
  });
});
```

**Pourquoi** : on simule de “vraies” requêtes HTTP contre l’application Express (middlewares, routes, validation, base).

---

## 8) Exécuter les tests et la couverture

* Lancer les tests :

```bash
npm test
```

* Générer la couverture :

```bash
npm run coverage
```

* Ouvrir le rapport HTML :

```bash
start coverage/index.html
```

---

## 9) Scénarios à tester (checklist)

* Requête valide complète (201)
* Requête invalide (400) : champ requis manquant (`price`), types incorrects (`price` string), valeurs interdites (prix négatif)
* Lecture de liste (200)
* Lecture par id inexistant (404)
* Lecture par id au mauvais format (400)
* Mise à jour partielle valide (200)
* Mise à jour invalide (400)
* Suppression d’un id inexistant (404)
* Suppression valide (200)

---

## 10) Dépannage courant

* `ERR_MODULE_NOT_FOUND` : vérifier le chemin et l’extension `.js` dans les imports ESM.
* `The requested module 'X' does not provide an export named 'Y'` : ajouter `export` dans le fichier source.
* Couverture à 0 % avec nyc : passer à `c8` (compatible ESM) et config `c8` dans `package.json`.
* Tests instables liés à la base : nettoyer la collection avec `deleteMany({})` en `beforeEach`.
* Ne pas démarrer `bin/www` dans les tests : `supertest` importe `app` directement.

---

## 11) Pourquoi valider côté API

* Protéger la base contre des données incohérentes ou malveillantes
* Rendre l’API prévisible (erreurs 400 claires)
* Réduire les bugs “logique” côté client
* Faciliter la maintenance et les évolutions du schéma

---

## 12) Alternatives à Joi

* **Zod** : syntaxe moderne, très utilisée avec TypeScript
* **Ajv** : validation JSON Schema, très rapide et standard
* **Yup** : souvent côté frontend

Le principe reste identique : définir un schéma et valider chaque requête.

---

### Résumé

1. Installer `mocha`, `chai`, `supertest`, `c8`, `joi`
2. Ajouter les scripts `test` et `coverage`
3. Écrire un test unitaire (utils)
4. Écrire des tests de modèle Mongoose
5. Écrire des tests d’intégration API (Supertest)
6. Ajouter la validation Joi dans les routes
7. Couvrir les scénarios valides/invalides
8. Générer et lire la couverture `c8`


 Parfait.
Voici une version **claire, concise et pédagogique** du README, sans tout le code, mais avec les parties essentielles **expliquées**.
Elle permet à un lecteur débutant de comprendre comment fonctionne la partie **Socket.IO (chat temps réel)** et **tests Jest**, sans être noyé dans le code complet.

---

#  Chat en temps réel et tests avec Jest

## 1. Objectif

Ce projet illustre la création d’un **chat en temps réel** à l’aide de **Socket.IO** intégré dans une application **Express.js**, avec une **base MongoDB** pour la persistance et **Jest** pour les tests automatiques.

L’objectif est de :

* permettre à plusieurs utilisateurs de discuter en direct ;
* gérer l’authentification avec un simple identifiant ;
* afficher les messages en temps réel sur une interface web ;
* automatiser la vérification du code à l’aide de tests unitaires et d’intégration.

---

## 2. Architecture du projet

Le projet est organisé de manière modulaire :

```
myapp/
│
├── app.js                → Configuration Express principale
├── bin/www               → Lancement du serveur + Socket.IO
├── routes/               → Contient les routes API (auth, posts, comments, etc.)
├── models/               → Modèles Mongoose
├── public/               → Interface web statique (chat.html, JS, CSS)
├── test/                 → Fichiers de tests Jest
└── .env                  → Variables d’environnement
```

---

## 3. Mise en place de Socket.IO

### Étape 1 — Installation

```bash
npm install socket.io jsonwebtoken
```

### Étape 2 — Intégration au serveur

Socket.IO est ajouté dans le fichier `bin/www` (qui démarre Express).
Il permet de gérer la connexion en temps réel entre clients et serveur.

Les étapes sont :

1. Créer un serveur HTTP à partir d’Express.
2. L’associer à une instance de Socket.IO.
3. Écouter les événements de connexion, messages, et déconnexion.

Chaque client connecté est identifié par un **ID Socket** et, après authentification, par son **nom d’utilisateur (username)**.

---

## 4. Authentification simple avec JWT

L’authentification repose sur un **token JWT** généré lors d’une connexion de démonstration (route `/auth/demo-login`).
L’utilisateur saisit simplement un nom d’utilisateur.
Le serveur lui renvoie un token qu’il utilisera pour s’authentifier via Socket.IO.

Cela permet d’associer chaque message à un utilisateur réel et d’éviter les utilisateurs anonymes dans le chat.

---

## 5. Fonctionnement du chat

Une fois connecté, l’utilisateur peut :

* rejoindre une salle de discussion (par exemple `/chat/:postId` ou privée entre deux utilisateurs) ;
* envoyer des messages instantanément ;
* voir les autres utilisateurs se connecter ou quitter ;
* recevoir tous les nouveaux messages sans recharger la page.

### Événements principaux :

| Événement         | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `authenticate`    | Le client envoie son token JWT au serveur.                                  |
| `joinPrivateChat` | Permet à deux utilisateurs de rejoindre une salle privée.                   |
| `privateMessage`  | Envoie un message dans cette salle.                                         |
| `disconnect`      | Informe les autres utilisateurs qu’un participant a quitté la conversation. |

Chaque message contient aussi :

* le nom de l’expéditeur,
* le contenu du message,
* et l’heure d’envoi.

---

## 6. Interface utilisateur

L’interface de chat est une simple page HTML (dans `public/chat.html`) avec :

* un champ pour le nom d’utilisateur ;
* une zone d’affichage des messages ;
* un champ de texte pour taper un message ;
* un bouton “Envoyer”.

L’apparence s’inspire des interfaces de messagerie comme Messenger ou ChatGPT :
les messages de l’utilisateur sont alignés à droite, ceux des autres à gauche.
Un message “X a rejoint/quitté le chat” apparaît automatiquement à chaque connexion/déconnexion.

---

## 7. Tests automatisés avec Jest

Le projet utilise **Jest** pour valider le bon fonctionnement des routes et du code.

### a. Installation

```bash
npm install --save-dev jest supertest
```

### b. Configuration

Dans `package.json` :

```json
"scripts": {
  "test:win": "set NODE_OPTIONS=--experimental-vm-modules && jest --runInBand --detectOpenHandles --forceExit"
},
"jest": {
  "testEnvironment": "node",
  "verbose": true,
  "transform": {}
}
```

### c. Tests principaux

* **users.test.js** : teste l’inscription et la connexion des utilisateurs (register / login).
* **posts.test.js** : teste la création et la récupération d’un article.
* **comments.test.js** : teste l’ajout, la récupération et la modification de commentaires.
* **api.products.test.js** : teste les opérations CRUD sur les produits.
* **product.test.js** : teste une fonction utilitaire de calcul de prix.
* **mockDB.test.js** : teste la connexion à MongoDB.

### d. Lancement des tests

Sous Windows :

```bash
npm run test:win
```

Sous macOS / Linux :

```bash
npm test
```

Les résultats affichent pour chaque test :

* **PASS** : test réussi,
* **FAIL** : test échoué,
* et le détail des erreurs si nécessaire.

---

## 8. Résolution des erreurs courantes

| Erreur                                         | Cause probable                                            | Solution                                                        |
| ---------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| `404 /users/register`                          | La route n’existe pas ou n’est pas importée dans `app.js` | Créer le fichier `routes/users.js` ou commenter le test         |
| `Cannot use import statement outside a module` | Jest ne gère pas encore bien les modules ES               | Ajouter `NODE_OPTIONS=--experimental-vm-modules` dans le script |
| `before is not defined`                        | Ancien test Mocha importé dans Jest                       | Remplacer `before`/`after` par `beforeAll`/`afterAll`           |
| Tests dupliqués ou ouverts                     | Mauvaise fermeture de connexion MongoDB                   | Fermer la connexion dans `afterAll()`                           |

---

## 9. Conclusion

Cette partie du projet met en place :

* une communication bidirectionnelle en temps réel avec Socket.IO,
* une authentification minimale via JWT,
* une interface web simple pour échanger des messages,
* et des tests Jest pour garantir la fiabilité de l’API.

Le tout constitue une base solide pour construire une application moderne combinant **API REST** et **chat interactif en temps réel**.

---


