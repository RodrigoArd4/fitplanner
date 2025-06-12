const express = require('express');
const app = express();
const port = 3000;

// Serve arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});