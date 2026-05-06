const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Conectado correctamente'))
    .catch((err) => console.log(err))
}

module.exports = {connectDB};