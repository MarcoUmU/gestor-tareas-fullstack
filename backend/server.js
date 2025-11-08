require('dotenv').config(); // Carga las variables del .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// --- MIDDLEWARES ---
app.use(cors()); // Permite peticiones del Frontend (otro dominio/puerto) (Mañana lo hago)
app.use(express.json()); // Esto es lo que nos permite leer JSON en el body de las peticiones

// --- CONEXIÓN ASÍNCRONA A MONGO ATLAS (Funciones Promise async/await como decia el profe Gallardo) ---
async function connectDB() {
  try {
    // Mongoose.connect devuelve una Promise
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB Atlas con éxito!');

    // Inicia el servidor solo si la conexión a la DB es exitosa
    app.listen(PORT, () => {
      console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    // Maneja el error de la Promise rechazada
    console.error('Error de conexión a la base de datos:', err);
    process.exit(1); // Sale de la aplicación
  }
}

// Ejecuta la función de conexión
connectDB();

// ...
const tareaRoutes = require('./routes/tareaRoutes'); // Importa las rutas

// --- INTEGRAR RUTAS AL SERVIDOR ---
// Todas las rutas del CRUD ahora estarán bajo el prefijo /api/tareas
app.use('/api/tareas', tareaRoutes);

// --- RUTA PRINCIPAL (Para ver que está corriendo) ---
// ... (deja el código de app.get('/') igual)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API de Tareas funcionando, ¡Lista para recibir rutas!' });
});

// ********** AQUÍ IRÁN LAS RUTAS DEL CRUD **********
// app.use('/api/tareas', tareaRoutes);