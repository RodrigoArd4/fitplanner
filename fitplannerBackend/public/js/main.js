// CADASTRO
document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("form-cadastro");
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            const resposta = await fetch("http://localhost:3000/api/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, email, senha }),
            });

            const dados = await resposta.json();
            alert(dados.message);

            if (resposta.ok) {
                window.location.href = "login.html"; // redireciona após cadastro
            }
        });
    }
});

// LOGIN
document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            try {
                const resposta = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, senha }),
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    localStorage.setItem("usuarioLogado", email);

                    if (dados.admin) {
                        localStorage.setItem("admin", "true");
                        window.location.href = "adminDashboard.html";
                    } else {
                        localStorage.setItem("admin", "false");

                        const etapa = dados.etapasConcluidas;
                        if (etapa === 0) {
                            window.location.href = "etapa1.html";
                        } else if (etapa === 1) {
                            window.location.href = "etapa2.html";
                        } else if (etapa === 2) {
                            window.location.href = "etapa3.html";
                        } else {
                            window.location.href = "dashboard.html";
                        }
                    }
                } else {
                    alert(dados.message || "Falha no login");
                }
            } catch (err) {
                console.error("Erro ao tentar login:", err);
                alert("Erro ao tentar login.");
            }
        });
    }
});





