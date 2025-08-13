const mongoose = require("mongoose") // Con la palabra reservada require importamos la dependencia. Aquí es este pedacito de código estamos diciendo, use la dependencia mongoose para crear un esquema

// Creación del esquema
const schemaProducto = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    nombre:{
        type: String,
        required: true,
        unique: false
    },
    precio:{
        type: Number,
        required: true,
        unique: false
    }
});

/*
String – cadena de texto
Number – de forma nativa mongo no admite numeros long o double 
Date – fecha
Boolean – booleanos (false, true)
Buffer – información binaria, como las imagenes
Mixed – lo que sea
Array
*/


const Producto = mongoose.model("Producto", schemaProducto);
module.exports = Producto; // Exportar el modelo, para poder utilizarlo en el back-end  

// hemos creado un modelo de producto denominado "Producto" a partir del esquema definido anteriormente. Ahora podemos utilizar el modelo "Producto" para realizar operaciones CRUD (crear, leer, actualizar y eliminar) en la base de datos MongoDB.