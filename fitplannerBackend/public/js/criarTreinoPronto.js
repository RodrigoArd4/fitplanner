document.addEventListener("DOMContentLoaded", async () => {
    const lista = document.getElementById("listaExercicios");
    const criarBtn = document.getElementById("criarBtn");

    const exercicios = await fetch("http://localhost:3000/api/exercicios").then(res => res.json());

    exercicios.forEach(ex => {
        lista.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${ex._id}" value="${ex.nome}">
                <label class="form-check-label" for="${ex._id}">${ex.nome}</label>
            </div>
        `;
    });

    criarBtn.addEventListener("click", async () => {
        const nome = document.getElementById("nomeTreino").value.trim();
        const selecionados = [...document.querySelectorAll("input:checked")].map(i => ({ nome: i.value, feito: false }));

        if (!nome || selecionados.length === 0) {
            alert("Preencha o nome e selecione ao menos um exercício.");
            return;
        }

        const res = await fetch("http://localhost:3000/api/treino-pronto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, exercicios: selecionados })
        });

        const dados = await res.json();
        alert(dados.message);
    });


    const carregarTreinosProntos = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/treinos-prontos");
            const treinos = await res.json();

            const tabela = document.getElementById("corpoTabelaTreinos");
            tabela.innerHTML = "";

            if (treinos.length === 0) {
                tabela.innerHTML = `<tr><td colspan="2" class="text-center text-muted">Nenhum treino pronto cadastrado.</td></tr>`;
                return;
            }

            treinos.forEach(treino => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                <td>${treino.nome}</td>
                <td>${treino.exercicios.map(e => e.nome).join(", ")}</td>
                <td>
                    <button class="btn btn-sm btn-danger excluir-btn" data-id="${treino._id}">Excluir</button>
                </td>
            `;

                const btn = linha.querySelector(".excluir-btn");

                btn.addEventListener("click", async () => {
                    const id = btn.getAttribute("data-id");

                    if (confirm("Deseja realmente excluir este treino pronto?")) {
                        try {
                            const res = await fetch(`http://localhost:3000/api/treino-pronto/${id}`, {
                                method: "DELETE"
                            });

                            if (!res.ok) {
                                const erro = await res.text(); // lê como texto pra não estourar JSON
                                throw new Error(erro);
                            }

                            const dados = await res.json();
                            alert(dados.message);
                            carregarTreinosProntos(); // Recarrega a lista
                        } catch (err) {
                            console.error("Erro ao excluir treino:", err);
                            alert("Erro ao excluir treino.");
                        }
                    }
                });
                tabela.appendChild(linha);
            });

        } catch (err) {
            console.error("Erro ao carregar treinos prontos:", err);
        }
    };
    await carregarTreinosProntos();
});
