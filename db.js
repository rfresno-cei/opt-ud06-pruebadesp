const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");

async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error conectando a MongoDB: " + error);
  }
}

module.exports = { client, connectDB };