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

            const resposta = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert("Login bem-sucedido!");
                localStorage.setItem("usuarioLogado", email); // salva quem logou
                window.location.href = "index.html"; // redireciona para a tela principal
            } else {
                alert(dados.message || "Falha no login");
            }
        });
    }
});

