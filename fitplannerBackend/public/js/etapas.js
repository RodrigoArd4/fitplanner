document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".objetivo-btn");

    if (botoes.length > 0) {
        botoes.forEach((botao) => {
            botao.addEventListener("click", () => {
                botao.classList.toggle("selecionado");
            });
        });

        const botaoContinuar = document.querySelector(".btn-continuar");

        if (botaoContinuar) {
            botaoContinuar.addEventListener("click", async () => {
                const selecionados = [];
                botoes.forEach((btn) => {
                    if (btn.classList.contains("selecionado")) {
                        selecionados.push(btn.textContent.trim());
                    }
                });

                const email = localStorage.getItem("usuarioLogado");
                if (!email || selecionados.length === 0) {
                    alert("Selecione pelo menos uma opção.");
                    return;
                }

                const etapa = pegarNumeroDaEtapa();

                const resposta = await fetch("http://localhost:3000/api/etapas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, etapa, dados: selecionados }),
                });

                const dados = await resposta.json();
                alert(dados.message);

                // Ir para a próxima etapa
                if (etapa === 1) {
                    window.location.href = "etapa2.html";
                } else if (etapa === 2) {
                    window.location.href = "etapa3.html";
                } else {
                    window.location.href = "index.html";
                }
            });
        }
    }

    // ETAPA 3: Captura dos dados físicos
    const formEtapa3 = document.getElementById("form-etapa3");
    if (formEtapa3) {
        formEtapa3.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = localStorage.getItem("usuarioLogado");
            if (!email) {
                alert("Usuário não identificado.");
                return;
            }

            const sexo = document.querySelector('input[name="sexo"]:checked')?.id || "";
            const idade = document.getElementById("idade").value;
            const altura = document.getElementById("altura").value;
            const peso = document.getElementById("peso").value;
            const lesoes = document.querySelector('input[name="lesoes"]:checked')?.id || "";
            const condicoes = document.getElementById("condicoes").value;

            const dados = {
                sexo,
                idade,
                altura,
                peso,
                lesoes,
                condicoes
            };

            const etapa = pegarNumeroDaEtapa();

            const resposta = await fetch("http://localhost:3000/api/etapas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, etapa, dados }),
            });

            const json = await resposta.json();
            alert(json.message);
            window.location.href = "index.html";
        });
    }
});

function pegarNumeroDaEtapa() {
    const pagina = window.location.pathname;
    if (pagina.includes("etapa1")) return 1;
    if (pagina.includes("etapa2")) return 2;
    if (pagina.includes("etapa3")) return 3;
    return 0;
}
