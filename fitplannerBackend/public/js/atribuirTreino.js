document.addEventListener("DOMContentLoaded", async () => {
    const usuarioSelect = document.getElementById("usuario");
    const treinoSelect = document.getElementById("treinoPronto");
    const diaSelect = document.getElementById("diaSemana");
    const atribuirBtn = document.getElementById("atribuirTreino");

    // Carregar usuários
    const carregarUsuarios = async () => {
        const res = await fetch("/api/usuarios");
        const usuarios = await res.json();
        usuarioSelect.innerHTML = '<option value="">Selecione</option>';
        usuarios.forEach(user => {
            usuarioSelect.innerHTML += `<option value="${user.email}">${user.nome} (${user.email})</option>`;
        });
    };

    // Carregar treinos prontos
    const carregarTreinos = async () => {
        const res = await fetch("/api/treinos-prontos");
        const treinos = await res.json();
        treinoSelect.innerHTML = '<option value="">Selecione</option>';
        treinos.forEach(tp => {
            treinoSelect.innerHTML += `<option value="${tp._id}">${tp.nome}</option>`;
        });
    };

    atribuirBtn.addEventListener("click", async () => {
        const email = usuarioSelect.value;
        const dia = diaSelect.value;
        const treinoId = treinoSelect.value;

        if (!email || !dia || !treinoId) {
            alert("Preencha todos os campos.");
            return;
        }

        const res = await fetch("/api/atribuir-treino", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, dia, treinoId })
        });

        const dados = await res.json();
        alert(dados.message);
    });

    await carregarUsuarios();
    await carregarTreinos();
});
