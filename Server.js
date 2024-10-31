const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const porta = 4002
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'chavosa',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } 
}));

const usuarios = { nicolas : 1234 };

app.get('/login', (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Digite your nome de ususario" />
      <input type="password" name="password" placeholder="Digite your senha, please" />
      <button type="submit">Login</button> <br />
      <h1> Trabalho desenvolvido pelos alunos: Nicolas e Rafael</h1>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (usuarios[username] && usuarios[username] === password) {
    req.session.usuario = username;
    res.redirect('/protected');
  } else {
    res.send('Usuário ou senha incorretos!');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Erro ao fazer logout!');
    res.redirect('/login');
  });
});

function authenticatines(req, res, next) {
  if (req.session.usuario) return next();
  res.redirect('/login');
}

app.get('/maxima-protection', authenticatines, (req, res) => {
  res.send(`Fala meu guri, ${req.session.usuario}! Estas em uma página super.`);
});

app.listen(porta, () => {
  console.log(`Rodando in server, in port ${porta}`);
});
