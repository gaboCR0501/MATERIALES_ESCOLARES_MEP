const CertificacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    institucion: {
        type: String,
        required: [true, 'La institución es requerida']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es requerida']
    }
}, { timestamps: true });