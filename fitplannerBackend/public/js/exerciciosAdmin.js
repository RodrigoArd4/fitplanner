document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("formExercicio");
    const tabela = document.getElementById("tabelaExercicios");
    const idEdicao = document.getElementById("idEdicao");

    const campos = {
        nome: document.getElementById("nome"),
        grupo: document.getElementById("grupo"),
        descricao: document.getElementById("descricao")
    };

    const carregarExercicios = async () => {
        const res = await fetch("/api/exercicios");
        const exercicios = await res.json();

        tabela.innerHTML = "";
        exercicios.forEach(ex => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${ex.nome}</td>
        <td>${ex.grupo}</td>
        <td>${ex.descricao || ""}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick='editarExercicio(${JSON.stringify(ex)})'>Editar</button>
          <button class="btn btn-sm btn-danger" onclick='deletarExercicio("${ex._id}")'>Excluir</button>
        </td>
      `;
            tabela.appendChild(tr);
        });
    };

    window.editarExercicio = (ex) => {
        idEdicao.value = ex._id;
        campos.nome.value = ex.nome;
        campos.grupo.value = ex.grupo;
        campos.descricao.value = ex.descricao || "";
    };

    window.deletarExercicio = async (id) => {
        if (confirm("Tem certeza que deseja excluir?")) {
            await fetch(`/api/exercicios/${id}`, { method: "DELETE" });
            await carregarExercicios();
        }
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dados = {
            nome: campos.nome.value,
            grupo: campos.grupo.value,
            descricao: campos.descricao.value
        };

        if (idEdicao.value) {
            // Atualizar
            await fetch(`/api/exercicios/${idEdicao.value}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
        } else {
            // Criar novo
            await fetch("/api/exercicios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
        }

        form.reset();
        idEdicao.value = "";
        await carregarExercicios();
    });

    await carregarExercicios();
});
