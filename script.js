const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    empresa TEXT NOT NULL,
    genero TEXT NOT NULL,
    imagem TEXT NOT NULL,
    preco REAL NOT NULL
)`);

app.get('/jogos', (req, res) => {
    db.all(`SELECT * FROM jogos`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ jogos: rows });
    });
});

app.post('/jogos', (req, res) => {
    const { nome, empresa, genero, imagem, preco } = req.body;
    const query = `INSERT INTO jogos (nome, empresa, genero, imagem, preco) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [nome, empresa, genero, imagem, preco], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            id: this.lastID,
            nome,
            empresa,
            genero,
            imagem,
            preco
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});