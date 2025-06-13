const mongoose = require('mongoose');
const Treino = require('./models/Treino');

mongoose.connect('mongodb+srv://admin:adminpass@cluster0.atczsyp.mongodb.net/fitplanner?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("🔧 Conectado ao MongoDB. Corrigindo treinos...");
        return corrigirTreinos();
    })
    .then(() => {
        console.log("✅ Treinos corrigidos com sucesso!");
        mongoose.disconnect();
    })
    .catch(err => {
        console.error("❌ Erro:", err);
        mongoose.disconnect();
    });

async function corrigirTreinos() {
    const treinos = await Treino.find({});
    for (const treino of treinos) {
        // Corrige apenas se estiver no formato antigo
        if (typeof treino.exercicios[0] === "string") {
            treino.exercicios = treino.exercicios.map(nome => ({ nome, feito: false }));
            await treino.save();
            console.log(`Treino de ${treino.email} (${treino.dia}) corrigido.`);
        }
    }
}
