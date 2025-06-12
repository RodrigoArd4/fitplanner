const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:adminpass@cluster0.atczsyp.mongodb.net/fitplanner?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Modelo
const ExercicioSchema = new mongoose.Schema({
  nome: String,
  grupo: String,
  grupoMuscular: String
});

const Exercicio = mongoose.model('Exercicio', ExercicioSchema);

async function atualizarExercicios() {
  try {
    const todos = await Exercicio.find();

    for (const exercicio of todos) {
      if (exercicio.grupoMuscular && !exercicio.grupo) {
        exercicio.grupo = exercicio.grupoMuscular;
      }

      exercicio.grupoMuscular = undefined; // remove o campo antigo
      await exercicio.save();
      console.log(`✅ Atualizado: ${exercicio.nome}`);
    }

    console.log("✅ Todos os exercícios foram atualizados.");
  } catch (err) {
    console.error("❌ Erro ao atualizar os exercícios:", err);
  } finally {
    mongoose.disconnect();
  }
}

atualizarExercicios();
