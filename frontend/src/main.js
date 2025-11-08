// frontend/main.js
const API_URL = 'http://localhost:3000/api/tareas'; // URL de tu Backend (Express)

//FUNCION PARA BUSCAR TAREAS CON FILTRO

function manejarBusqueda(event) {
    // 1. Obtenemos lo que el usuario escribió en el campo
    const termino = event.target.value;
    
    // 2. Llamamos a cargarTareas con el término para filtrar la lista
    cargarTareas(termino);
}

// ********* FUNCIÓN DE LECTURA (READ - GET) *********
// Usa async/await para manejar la Promise de fetch
async function cargarTareas(searchQuery = '') {

    let url = API_URL;
    
    // Si hay un término, lo añade como query string: /api/tareas?q=texto
    if (searchQuery) {
        url = `${API_URL}?q=${encodeURIComponent(searchQuery)}`;
    }

    try {
        // Primera Promise: La petición HTTP
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Segunda Promise: Parsear el cuerpo a JSON
        const tareas = await response.json(); 
        
        renderizarTareas(tareas);
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
        document.getElementById('app').innerHTML = '<h3 class="text-danger text-center"> No se pudo conectar al servidor de tareas.</h3>';
    }
}

// ********* FUNCIÓN PARA CREAR (CREATE - POST) *********
async function manejarCrear(event) {
    event.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;

    try {
        // Promise de envío de datos con método POST
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descripcion })
        });

        if (response.status !== 201) { // 201 Created es la respuesta esperada
             throw new Error(`Error al crear: ${response.status}`);
        }

        // Limpiar formulario y recargar lista 
        document.getElementById('tareaForm').reset();
        cargarTareas();

    } catch (error) {
        console.error('Error al crear la tarea:', error);
    }
}

// ********* FUNCIÓN PARA ACTUALIZAR (UPDATE - PUT) *********
async function manejarActualizar(id, completada) {
    try {
        // Promise para actualizar el estado
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completada }) 
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar: ${response.status}`);
        }

        // Recargar la lista para mostrar el cambio
        cargarTareas();

    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
    }
}

// ********* FUNCIÓN PARA ELIMINAR (DELETE) *********
async function manejarEliminar(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

    try {
        // Promise de eliminación
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.status !== 204) { // 204 No Content es la respuesta esperada
            throw new Error(`Error al eliminar: ${response.status}`);
        }

        // Recargar la lista
        cargarTareas();

    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
    }
}


// ********* LÓGICA DE RENDERIZADO (Componente de UI) *********

function renderizarTareas(tareas) {
    const listaHTML = tareas.map(tarea => {
        
        // 1. Clases de Borde y Fondo: Se ajusta el borde a 'warning' (amarillo) para las tareas Pendientes.
        const cardClass = tarea.completada ? 'border-success' : 'border-warning'; 
        
        // 2. Clases de Background: Se usa 'bg-white' para un fondo limpio en las pendientes.
        const bgClass = tarea.completada ? 'bg-success bg-opacity-10' : 'bg-white shadow-sm';
        
        // 3. Badge de Estado: Se usa 'text-bg-warning' para las pendientes.
        const statusBadge = tarea.completada 
            ? '<span class="badge text-bg-success">Completada</span>'
            : '<span class="badge text-bg-warning">Pendiente</span>'; 

        return `
            <div class="card mb-3 p-3 shadow-sm ${bgClass} ${cardClass}">
                <div class="card-body p-0">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="card-title ${tarea.completada ? 'text-decoration-line-through text-success' : 'fw-bold'} mb-1">
                                ${tarea.titulo} ${statusBadge}
                            </h5>
                            <p class="card-text text-muted mb-2">
                                ${tarea.descripcion}
                            </p>
                        </div>

                        <div class="ms-3 d-flex flex-column align-items-end">
                            <button class="btn btn-sm mb-2 ${tarea.completada ? 'btn-warning' : 'btn-success'}" 
                                    onclick="manejarActualizar('${tarea._id}', ${!tarea.completada})">
                                ${tarea.completada ? 'Deshacer' : 'Completar'}
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="manejarEliminar('${tarea._id}')">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('lista-tareas').innerHTML = listaHTML.length ? listaHTML : '<p class="text-center text-muted p-5 border rounded">¡No hay tareas pendientes! Crea una nueva tarea para empezar.</p>';
}

// ********* INICIALIZACIÓN DE LA APLICACIÓN *********

document.addEventListener('DOMContentLoaded', () => {
    // Monta la estructura HTML (Añadiendo una fila y columnas para centrar)
    document.getElementById('app').innerHTML = `
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
                <h1 class="text-center mb-4">Gestor de Tareas/Pendientes</h1>
                
                <div class="mb-4 shadow-sm">
                    <input type="text" id="searchInput" class="form-control form-control-lg border-primary" placeholder="Buscar tareas por título o descripción...">
                </div>
                
                <div class="card mb-4 p-4 shadow">
                    <h5 class="card-title text-primary mb-3">Agregar Nueva Tarea</h5>
                    <form id="tareaForm">
                        <div class="mb-3">
                            <label for="titulo" class="form-label">Título</label>
                            <input type="text" class="form-control" id="titulo" required>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <input type="text" class="form-control" id="descripcion">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Crear Tarea</button>
                    </form>
                </div>
                
                <h2 class="mt-5 mb-3">Tareas Pendientes</h2>
                <div id="lista-tareas">
                    <p class="text-center">Cargando tareas...</p>
                </div>
            </div>
        </div>
    `;
    
    // ... (El resto de la sección de eventos sigue igual)
    document.getElementById('tareaForm').addEventListener('submit', manejarCrear);
    document.getElementById('searchInput').addEventListener('keyup', manejarBusqueda);
    cargarTareas(); 
});

// Hace que las funciones CRUD estén disponibles globalmente para los botones onclick
window.manejarActualizar = manejarActualizar;
window.manejarEliminar = manejarEliminar;