// myapp/db.js
const mongoose = require("mongoose");
require("dotenv").config(); // PAS de chemin relatif ici, car le .env est dans le même dossier

const uri = process.env.MONGODB_URI;

console.log("URI lue depuis .env =", uri); // <-- pour tester

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connecté à MongoDB Atlas");
  } catch (err) {
    console.error("Erreur de connexion MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
