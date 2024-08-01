require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.query('SELECT 1 + 1 AS solution', (error, results) => {
  if (error) {
    console.error('Error al conectarse a la base de datos:', error.message);
    process.exit(1); // Salir con código de error
  } else {
    console.log('Conexión exitosa. Resultado de la consulta:', results[0].solution);
    process.exit(0); // Salir sin errores
  }
});
