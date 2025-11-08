// backend/server.js (Versión CORREGIDA para Render)
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
// Render asigna el puerto. Usamos process.env.PORT o 3000 como fallback.
const PORT = process.env.PORT || 3000; 
const MONGO_URI = process.env.MONGO_URI;

// --- MIDDLEWARES (CORREGIDO: cors debe ir sin comentarios) ---
app.use(cors()); 
app.use(express.json()); 

// Importa las rutas del CRUD
const tareaRoutes = require('./routes/tareaRoutes'); 
app.use('/api/tareas', tareaRoutes);

// --- RUTA PRINCIPAL ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API de Tareas funcionando y lista.' });
});

// --- CONEXIÓN ASÍNCRONA A MONGO ATLAS (Promises) ---
async function connectDB() {
  try {
    // Intenta la conexión a la DB
    await mongoose.connect(MONGO_URI);
    console.log(' Conectado a MongoDB Atlas con éxito!');
  } catch (err) {
    // Reporta el error si no se conecta, pero NO detiene el servidor de Express
    console.error('Error de conexión a la base de datos:', err);
    // Si la DB falla, Render no verá un error fatal de Express y podrá continuar.
  }
}

// 1. Ejecuta la función de conexión a la DB
connectDB();

// 2. Inicia el servidor de Express (ESTO DEBE IR FUERA DE CONNECTDB)
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express escuchando en puerto ${PORT}`);
});