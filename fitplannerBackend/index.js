const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Treino = require('./models/Treino');
const Exercicio = require('./models/Exercicio');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));


// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor Fitplanner rodando 🚀');
});

const Usuario = require('./models/Usuario');

// CADASTRO
app.post('/api/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const existe = await Usuario.findOne({ email });
        if (existe) return res.status(400).json({ message: "Email já cadastrado." });

        const novoUsuario = new Usuario({ nome, email, senha });
        await novoUsuario.save();

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        console.error("Erro ao cadastrar:", err);
        res.status(500).json({ message: "Erro no servidor." });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: "Email não encontrado." });
        }

        if (usuario.senha !== senha) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: "Senha incorreta." });
        }

        console.log("Login bem-sucedido!");
        res.status(200).json({
            message: "Login bem-sucedido!",
            nome: usuario.nome,
            email: usuario.email,
            etapasConcluidas: usuario.etapasConcluidas || 0
        });
    } catch (err) {
        console.error("Erro ao logar:", err);
        res.status(500).json({ message: "Erro no servidor." });
    }
});



// Conexao mongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:adminpass@cluster0.atczsyp.mongodb.net/fitplanner?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
    .catch((err) => console.error("Erro na conexão:", err));



app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

//Salvando preferencias do usuario
app.post('/api/etapas', async (req, res) => {
    const { email, etapa, dados } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });

        // Salvar dados da etapa
        if (!usuario.preferencias) {
            usuario.preferencias = new Map();
        }
        usuario.preferencias.set(`etapa${etapa}`, dados)
        usuario.etapasConcluidas = etapa; // marca que essa etapa foi concluída
        await usuario.save();

        res.status(200).json({ message: "Etapa salva com sucesso!" });
    } catch (err) {
        console.error("Erro ao salvar etapa:", err);
        res.status(500).json({ message: "Erro ao salvar etapa." });
    }
});



// Listar usuários
app.get("/api/usuarios", async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, "nome email"); // pega só nome e email
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: "Erro ao carregar usuários" });
    }
});

// Listar exercícios
app.get("/api/exercicios", async (req, res) => {
    try {
        const exercicios = await Exercicio.find({});
        res.json(exercicios);
    } catch (err) {
        res.status(500).json({ message: "Erro ao carregar exercícios" });
    }
});

// Salvar treino personalizado
app.post("/api/salvar-treino", async (req, res) => {
    const { email, dia, exercicios } = req.body;

    try {
        // Tenta atualizar o treino existente
        const atualizado = await Treino.findOneAndUpdate(
            { email, dia },
            { $set: { exercicios } },
            { new: true } // retorna o documento atualizado
        );

        if (atualizado) {
            return res.status(200).json({ message: "Treino atualizado com sucesso!" });
        }

        // Se não existe, cria um novo treino
        const novoTreino = new Treino({ email, dia, exercicios });
        await novoTreino.save();

        return res.status(201).json({ message: "Treino salvo com sucesso!" });

    } catch (err) {
        console.error("Erro ao salvar treino:", err);
        return res.status(500).json({ message: "Erro ao salvar treino." });
    }
});


// Rota para buscar o treino do dia de um usuário
app.get('/api/treino-do-dia', async (req, res) => {
    const { email, dia } = req.query;
    try {
        const treino = await Treino.findOne({ email, dia });
        if (!treino) {
            return res.status(200).json({ exercicios: [] }); // Sem treino, mas resposta OK
        }

        res.status(200).json(treino);
    } catch (err) {
        console.error("Erro ao buscar treino do dia:", err);
        res.status(500).json({ message: "Erro ao buscar treino." });
    }
});

app.post("/api/marcar-exercicio", async (req, res) => {
    const { email, dia, nome, feito } = req.body;

    try {
        const treino = await Treino.findOne({ email, dia });
        if (!treino) return res.status(404).json({ message: "Treino não encontrado." });

        const ex = treino.exercicios.find(e => e.nome === nome);
        if (ex) {
            ex.feito = feito;
            await treino.save();
            return res.json({ message: "Exercício atualizado com sucesso." });
        }

        res.status(404).json({ message: "Exercício não encontrado." });
    } catch (err) {
        console.error("Erro ao atualizar exercício:", err);
        res.status(500).json({ message: "Erro ao atualizar exercício." });
    }
});


