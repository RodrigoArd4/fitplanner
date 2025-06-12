const mongoose = require('mongoose');

const TreinoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  dia: {
    type: String,
    required: true
  },
  exercicios: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Treino', TreinoSchema);
