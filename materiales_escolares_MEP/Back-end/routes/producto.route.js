const express = require("express"); 
const router = express.Router(); // Crear la señal
const Producto = require("../models/producto.model"); 

// Rutas
// POST: Crear, enviar datos al servidor (tomar todos los datos que nos envia el cliente y los vamos a enviar al servidor)  
router.post("/", async(req, res) => {
    const {codigo, nombre, precio} = req.body;

    if(!codigo || !nombre || !precio){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try {
        const nuevoProducto = new Producto({codigo, nombre, precio});
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto); // 201: El recurso se creó correctamente 
    } catch (error) {
        res.status(400).json({msj:error.message});
    }

});

// GET: Solicitar datos al servidor
router.get("/", async(req, res) => {
    // Manejo de errores con try y catch: Recuerden que el try es para intentar hacer lo definido pero en caso de que algo falle hace lo que se indique en el catch  
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({msj:error.message});        
    }

});

module.exports = router;