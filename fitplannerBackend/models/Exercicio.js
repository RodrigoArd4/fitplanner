const mongoose = require("mongoose");

const ExercicioSchema = new mongoose.Schema({
    nome: String,
    grupo: String,
    descricao: String
});

module.exports = mongoose.model("Exercicio", ExercicioSchema);
