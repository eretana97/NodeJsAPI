// Importa el módulo mysql
const mysql = require('mysql');

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost', // Cambia esto por la dirección de tu servidor MySQL
  user: 'root', // Cambia esto por tu nombre de usuario de MySQL
  password: 'root', // Cambia esto por tu contraseña de MySQL
  database: 'testwork' // Cambia esto por el nombre de tu base de datos
});

// Conecta a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Realiza consultas
connection.query('SELECT * FROM usuarios', (error, results, fields) => {
  if (error) {
    console.error('Error al realizar la consulta:', error);
    return;
  }
  console.log('Resultados de la consulta:', results);
});

// Cierra la conexión cuando hayas terminado
connection.end((error) => {
  if (error) {
    console.error('Error al cerrar la conexión:', error);
    return;
  }
  console.log('Conexión cerrada exitosamente');
});

