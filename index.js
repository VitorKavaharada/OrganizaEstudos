const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const app = express();

const conn = require('./db/conn');
const Study = require('./models/Study');
const User = require('./models/User');
const studyRoutes = require('./routes/studyRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/studies', studyRoutes);
app.use('/auth', authRoutes);

//Raiz para a página de login
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

conn.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((error) => console.log(error));