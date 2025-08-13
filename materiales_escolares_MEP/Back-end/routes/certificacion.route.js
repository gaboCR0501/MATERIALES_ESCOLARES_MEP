router.post("/", async (req, res) => {
    try {
        // Verifica que los campos existan en el cuerpo de la solicitud
        if (!req.body.nombre || !req.body.institucion || !req.body.descripcion) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos",
                camposFaltantes: {
                    nombre: !req.body.nombre,
                    institucion: !req.body.institucion,
                    descripcion: !req.body.descripcion
                }
            });
        }

        const nuevaCertificacion = new Certificacion(req.body);
        const certificacionGuardada = await nuevaCertificacion.save();

        res.status(201).json({
            success: true,
            data: certificacionGuardada,
            message: "Certificación creada exitosamente"
        });

    } catch (error) {
        // Manejo específico para errores de validación
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                errores: errores
            });
        }

        // Otros tipos de errores
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
});