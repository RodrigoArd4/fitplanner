const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
        const usuario = await Usuario.findOne({ email, senha });
        if (!usuario) return res.status(401).json({ message: "Email ou senha inválidos." });

        res.status(200).json({ message: "Login bem-sucedido!", nome: usuario.nome });
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