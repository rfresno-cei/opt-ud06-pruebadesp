const {connectDB} = require('./db');
const fs = require('fs');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');

connectDB();

const app = require('./app');

const file = fs.readFileSync('./api/ffapi.yaml', 'utf8');
const parsed = YAML.parse(file);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(parsed));

app.listen(process.env.PORT, () => {
    console.log('Servidor arrancado');
})