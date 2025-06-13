const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    admin: {
        type: Boolean,
        default: false
    },
    etapasConcluidas: {
        type: Number,
        default: 0
    },
    preferencias: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
