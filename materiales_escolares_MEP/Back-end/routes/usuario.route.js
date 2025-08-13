const express = require("express"); 
const router = express.Router(); // Crear la señal
const Usuario = require("../models/usuario.model"); 
const Certificacion = require("../models/certificacion.model");

// Rutas
// POST: Crear, enviar datos al servidor. Nosotros vamos a tomar todos los datos que nos envia el cliente y los vamos a enviar al servidor  

router.post("/", async(req, res) => {
    const {correo, cedula, nombre, contrasenia} = req.body;

    if(!correo || !cedula || !nombre || !contrasenia){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try {
        const nuevoUsuario = new Usuario({correo, cedula, nombre, contrasenia});
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario); // 201: El recurso se creó correctamente 
    } catch (error) {
        res.status(400).json({msj:error.message})
    }

});


// GET: Solicitar datos al servidor (listar usuarios)
router.get("/", async(req, res) => {
    try {
        const usuarios = await Usuario.find().populate("certificaciones");
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

// GET: Obtener los datos de un usuario por cédula
router.get("/buscar-por-cedula", async (req, res) => {
    try {
        const { cedula } = req.body;
        
        if (!cedula) {
            return res.status(400).json({msj: "El campo 'cédula' es obligatorio"});
        }

        const usuario = await Usuario.findOne({ cedula }).populate("certificaciones");
        
        if (!usuario) {
            return res.status(404).json({ 
                msj: "No se encontró usuario con la cédula proporcionada" 
            });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({msj: "Error en el servidor al buscar usuario", 
            error: error.message});
    }
});

//PUT: Actualizar información
router.put("/agregar-certificacion", async (req, res) => {
    const {cedula, certificacionId} = req.body;

    if (!cedula || !certificacionId){
        return res.status(400).json({msj: "Cédula y el Id de la certificación son obligatorios"});
    }

    try {
        // Verificar que la certificación existe
        const certificacion = await Certificacion.findById(certificacionId);
        if(!certificacion){
            return res.status(404).json({msj: "Certificación no existe"});    
        }

        //Buscar el usuario y agregar la certificación si no existe 
        const usuario = await Usuario.findOne({cedula})
        if (!usuario){
            return res.status(404).json({msj: "Usuario no encontrado"});    
        }
        if (!usuario.certificaciones.includes(certificacionId)){
            usuario.certificaciones.push(certificacionId);
            await usuario.save();
        }
        res.status(200).json({msj: "Certificación agregada al usuario", usuario});  

    } catch (error) {
        res.status(500).json({msj: "Error al agregar la certificación", error});  
    }
});

// DELETE: Eliminar un usuario por cédula 
router.delete("/eliminar-por-cedula", async (req, res) => {
    try {
        const { cedula } = req.body;

        if (!cedula) {
            return res.status(400).json({msj: "El campo 'cedula' es obligatorio en el cuerpo de la solicitud"});
        }

        const resultado = await Usuario.deleteOne({ cedula });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({msj: "No se encontró usuario con la cédula proporcionada"});
        }

        res.json({ 
            msj: "Usuario eliminado correctamente",
            cedula: cedula,
            registrosEliminados: resultado.deletedCount
        });
    } catch (error) {
        res.status(500).json({msj: "Error en el servidor al eliminar usuario", 
            error: error.message});
    }
});

module.exports = router;