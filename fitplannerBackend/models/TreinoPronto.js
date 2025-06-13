const mongoose = require('mongoose');

const TreinoProntoSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  exercicios: [
    {
      nome: String,
      feito: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model("TreinoPronto", TreinoProntoSchema);
