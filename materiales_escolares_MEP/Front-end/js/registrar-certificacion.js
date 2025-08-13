document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const form = document.querySelector('form');
    const inputNombre = document.getElementById('txtNombre');
    const inputInstitucion = document.getElementById('txtInstitucion');
    const inputDescripcion = document.getElementById('txtDescripcion');
    const btnGuardar = document.getElementById('btnGuardar');

    // Contenedor de mensajes
    const mensajeContainer = document.createElement('div');
    mensajeContainer.id = 'mensaje-container';
    form.insertBefore(mensajeContainer, form.lastElementChild);

    // Aplicar estilos al contenedor de mensajes
    Object.assign(mensajeContainer.style, {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        display: 'none'
    });

    // Validar campos en tiempo real
    [inputNombre, inputInstitucion, inputDescripcion].forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '';
                limpiarError(this.id);
            }
        });
    });

    // Función para mostrar mensajes
    function mostrarMensaje(texto, tipo = 'error') {
        mensajeContainer.textContent = texto;
        mensajeContainer.style.display = 'block';
        
        // Resetear clases
        mensajeContainer.className = '';
        mensajeContainer.classList.add(tipo);
    }

    // Función para ocultar mensajes
    function ocultarMensaje() {
        mensajeContainer.style.display = 'none';
    }

    // Función para mostrar error específico
    function mostrarError(campoId, mensaje) {
        const campo = document.getElementById(campoId);
        campo.style.borderColor = '#dc3545';
        
        // Crear elemento de error si no existe
        let errorSpan = campo.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-mensaje')) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-mensaje';
            errorSpan.style.color = '#dc3545';
            errorSpan.style.fontSize = '0.875rem';
            campo.parentNode.insertBefore(errorSpan, campo.nextSibling);
        }
        errorSpan.textContent = mensaje;
    }

    // Función para limpiar errores
    function limpiarError(campoId) {
        const campo = document.getElementById(campoId);
        campo.style.borderColor = '';
        
        const errorSpan = campo.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error-mensaje')) {
            errorSpan.remove();
        }
    }

    // Validar todos los campos
    function validarCampos() {
        let valido = true;
        
        // Verificar cada campo requerido
        if (inputNombre.value.trim() === '') {
            mostrarError('txtNombre', 'El nombre es requerido');
            valido = false;
        }
        
        if (inputInstitucion.value.trim() === '') {
            mostrarError('txtInstitucion', 'La institución es requerida');
            valido = false;
        }
        
        if (inputDescripcion.value.trim() === '') {
            mostrarError('txtDescripcion', 'La descripción es requerida');
            valido = false;
        }
        
        return valido;
    }

    // Registrar certificación
    async function registrarCertificacion() {
        // Validar campos primero
        if (!validarCampos()) {
            mostrarMensaje('Por favor complete todos los campos requeridos');
            return;
        }

        // Preparar datos para enviar (en minúsculas para el backend)
        const datos = {
            nombre: inputNombre.value.trim(),
            institucion: inputInstitucion.value.trim(),
            descripcion: inputDescripcion.value.trim()
        };

        mostrarMensaje('Registrando certificación...', 'cargando');

        try {
            const response = await fetch('http://localhost:3000/certificaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const data = await response.json();

            if (!response.ok) {
                // Manejar errores de validación del backend
                if (data.errors) {
                    const errorMessages = data.errors.join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(data.message || 'Error al registrar la certificación');
            }

            mostrarMensaje('Certificación registrada con éxito', 'exito');
            form.reset();
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(ocultarMensaje, 3000);
            
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje(error.message || 'Ocurrió un error al registrar la certificación');
        }
    }

    // Evento del botón Guardar
    btnGuardar.addEventListener('click', registrarCertificacion);
});