// myapp/app.js
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');     // import connexion Mongo
const Product = require('./models/Product'); // import modèle
const productsRouter = require("./routes/products");


// Connexion MongoDB au démarrage
connectDB();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Middlewares par défaut du générateur
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/products", productsRouter);

// Exemple de route MongoDB
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
});

// Routes existantes
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
