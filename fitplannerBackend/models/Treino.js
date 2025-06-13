const mongoose = require('mongoose');

const exercicioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  feito: { type: Boolean, default: false }
});

const treinoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  dia: { type: String, required: true },
  exercicios: [exercicioSchema]
});

module.exports = mongoose.model("Treino", treinoSchema);
