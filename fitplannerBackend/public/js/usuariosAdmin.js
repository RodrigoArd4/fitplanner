document.addEventListener("DOMContentLoaded", async () => {
    const tabela = document.getElementById("tabelaUsuarios");
    const msg = document.getElementById("mensagem");

    const carregarUsuarios = async () => {
        const res = await fetch("/api/usuarios-completo");
        const usuarios = await res.json();

        tabela.innerHTML = "";
        usuarios.forEach(user => {
            tabela.innerHTML += `
        <tr>
          <td><input class="form-control" value="${user.nome}" data-id="${user._id}" data-campo="nome" /></td>
          <td><input class="form-control" value="${user.email}" data-id="${user._id}" data-campo="email" /></td>
          <td>
            <input type="checkbox" ${user.admin ? "checked" : ""} data-id="${user._id}" data-campo="admin" />
          </td>
          <td>
            <button class="btn btn-sm btn-success" onclick="atualizarUsuario('${user._id}')">Salvar</button>
            <button class="btn btn-sm btn-danger" onclick="deletarUsuario('${user._id}')">Excluir</button>
          </td>
        </tr>
      `;
        });
    };

    window.atualizarUsuario = async (id) => {
        const inputs = document.querySelectorAll(`[data-id='${id}']`);
        const dados = {};

        inputs.forEach(input => {
            const campo = input.getAttribute("data-campo");
            dados[campo] = campo === "admin" ? input.checked : input.value;
        });

        const res = await fetch(`/api/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        const result = await res.json();
        msg.innerHTML = `<div class="alert alert-info">${result.message}</div>`;
        await carregarUsuarios();
    };

    window.deletarUsuario = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

        const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        const result = await res.json();
        msg.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
        await carregarUsuarios();
    };

    await carregarUsuarios();
});
