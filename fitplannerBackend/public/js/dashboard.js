document.addEventListener("DOMContentLoaded", async () => {
  console.log("⚡ Dashboard carregado");

  const container = document.getElementById("treino-container");
  const emailUsuario = localStorage.getItem("usuarioLogado");

  if (!emailUsuario) {
    container.innerHTML = `<p class="text-danger">Usuário não logado.</p>`;
    return;
  }

  const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const diaSemana = diasSemana[new Date().getDay()];

  try {
    const resposta = await fetch(`http://localhost:3000/api/treino-do-dia?email=${emailUsuario}&dia=${diaSemana}`);
    const dados = await resposta.json();

    if (resposta.ok) {
      if (dados.exercicios && dados.exercicios.length > 0) {
        container.innerHTML = `<h4 class="mb-3">Treino de ${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}</h4>`;

        dados.exercicios.forEach((ex, index) => {
          const div = document.createElement("div");
          div.classList.add("form-check");

          div.innerHTML = `
            <input class="form-check-input" type="checkbox" id="ex${index}" ${ex.feito ? "checked" : ""}>
            <label class="form-check-label" for="ex${index}">${ex.nome}</label>
          `;

          const checkbox = div.querySelector("input");
          checkbox.addEventListener("change", () => {
            marcarComoFeito(emailUsuario, diaSemana, ex.nome, checkbox.checked);
          });

          container.appendChild(div);
        });
      } else {
        container.innerHTML = `<p class="text-warning">Nenhum treino programado para hoje.</p>`;
      }
    } else {
      container.innerHTML = `<p class="text-danger">${dados.message}</p>`;
    }
  } catch (err) {
    container.innerHTML = `<p class="text-danger">Erro ao buscar treino.</p>`;
    console.error(err);
  }
});

async function marcarComoFeito(email, dia, nome, feito) {
  try {
    await fetch("http://localhost:3000/api/marcar-exercicio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, dia, nome, feito })
    });
  } catch (err) {
    console.error("Erro ao marcar exercício como feito:", err);
  }
}
