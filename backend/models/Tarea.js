const mongoose = require('mongoose');

// Defino en esta parte el Schema (estructura (tipo la tabla en db)) de las tareas
const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true, // Debe tener un título
    trim: true
  },
  descripcion: {
    type: String,
    required: false,
    default: 'Sin descripción'
  },
  completada: {
    type: Boolean,
    default: false // Por defecto, la tarea está incompleta
  }
}, {
  timestamps: true // Agrega campos createdAt y updatedAt automáticamente (Creacion del campo y actualizacion del campo)
});

// Crea y exporta el Modelo
module.exports = mongoose.model('Tarea', tareaSchema);