document.addEventListener("DOMContentLoaded", async () => {
    const usuarioSelect = document.getElementById("usuario");
    const grupoSelect = document.getElementById("grupoMuscular");
    const listaExercicios = document.getElementById("listaExercicios");
    const salvarBtn = document.getElementById("salvarTreino");

    let todosExercicios = [];

    // Carregar usuários
    const carregarUsuarios = async () => {
        const res = await fetch("http://localhost:3000/api/usuarios");
        const usuarios = await res.json();

        usuarioSelect.innerHTML = `<option value="">Selecione um usuário</option>`;
        usuarios.forEach(user => {
            usuarioSelect.innerHTML += `<option value="${user.email}">${user.nome} (${user.email})</option>`;
        });
    };

    // Carregar exercícios
    const carregarExercicios = async () => {
        const res = await fetch("http://localhost:3000/api/exercicios");
        todosExercicios = await res.json();
        exibirExercicios(); // Exibe todos inicialmente
    };

    // Exibir exercícios na tela com base no grupo muscular
    const exibirExercicios = () => {
        const grupoSelecionado = grupoSelect.value;
        console.log("Grupo selecionado:", grupoSelecionado);
        console.log("Todos os exercícios:", todosExercicios);

        let filtrados;

        if (grupoSelecionado && grupoSelecionado !== "todos") {
            filtrados = todosExercicios.filter(ex => {
                const grupoEx = ex.grupo?.toLowerCase().trim();
                const grupoSelecionadoNormalizado = grupoSelecionado.toLowerCase().trim();
                console.log(`Comparando: ${grupoEx} === ${grupoSelecionadoNormalizado}`);
                return grupoEx === grupoSelecionadoNormalizado;
            });
        } else {
            filtrados = todosExercicios;
        }

        listaExercicios.innerHTML = `<label class="form-label">Exercícios:</label>`;

        if (filtrados.length === 0) {
            listaExercicios.innerHTML += `<p class="text-muted">Nenhum exercício encontrado para este grupo.</p>`;
        }

        filtrados.forEach(ex => {
            listaExercicios.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${ex._id}" value="${ex.nome}">
                <label class="form-check-label" for="${ex._id}">${ex.nome}</label>
            </div>
        `;
        });
    };


    // Evento de mudança no grupo muscular
    grupoSelect.addEventListener("change", exibirExercicios);

    // Salvar treino
    salvarBtn.addEventListener("click", async () => {
        const email = usuarioSelect.value;
        const dia = document.getElementById("diaSemana").value;
        const selecionados = [...document.querySelectorAll("#listaExercicios input:checked")].map(input => ({
            nome: input.value,
            feito: false
        }));
        if (!email || selecionados.length === 0) {
            alert("Selecione um usuário e ao menos um exercício.");
            return;
        }

        const resposta = await fetch("http://localhost:3000/api/salvar-treino", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, dia, exercicios: selecionados }),
        });

        const dados = await resposta.json();
        alert(dados.message);
    });

    await carregarUsuarios();
    await carregarExercicios();
});
