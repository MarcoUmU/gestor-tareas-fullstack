const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea'); // Importa el modelo

// RUTA 1: CONSULTAR (READ) - Obtener tareas, CON FILTRO DE BÚSQUEDA
router.get('/', async (req, res) => {
    try {
        // 1. Obtener el término de búsqueda 'q' de la URL (Query String)
        const { q } = req.query;
        let filtro = {};

        // 2. Si existe 'q', creamos la regla para MongoDB (Mongoose)
        if (q) {
            filtro = {
                // $or: busca el texto en 'titulo' O en 'descripcion'
                $or: [
                    { titulo: { $regex: q, $options: 'i' } }, // $regex: busca coincidencias; 'i': ignora mayúsculas/minúsculas
                    { descripcion: { $regex: q, $options: 'i' } }
                ]
            };
        }

        // 3. Mongoose usa la Promise. Aplica el filtro (si está vacío, trae todo)
        const tareas = await Tarea.find(filtro).sort({ createdAt: -1 }); 
        res.status(200).json(tareas);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).json({ message: 'Error al obtener las tareas.' });
    }
});

// RUTA 2: INSERTAR (CREATE) - Crear una nueva tarea
router.post('/', async (req, res) => {
    const { titulo, descripcion } = req.body;
    const nuevaTarea = new Tarea({ titulo, descripcion });

    try {
        // nuevaTarea.save() devuelve una Promise. Usamos await.
        const tareaGuardada = await nuevaTarea.save(); 
        res.status(201).json(tareaGuardada);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al crear la tarea.' });
    }
});

// RUTA 3: ACTUALIZAR (UPDATE) - Actualizar una tarea por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const actualizacion = req.body;

    try {
        // findByIdAndUpdate() devuelve una Promise. Usamos await.
        const tareaActualizada = await Tarea.findByIdAndUpdate(id, actualizacion, { new: true }); 

        if (!tareaActualizada) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        res.status(200).json(tareaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la tarea.' });
    }
});

// RUTA 4: ELIMINAR (DELETE) - Eliminar una tarea por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // findByIdAndDelete() devuelve una Promise. Usamos await.
        const tareaEliminada = await Tarea.findByIdAndDelete(id); 

        if (!tareaEliminada) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        // 204 No Content es el código estándar para una eliminación exitosa
        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la tarea.' });
    }
});

module.exports = router;