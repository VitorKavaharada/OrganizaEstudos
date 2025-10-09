const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const conn = require('./db/conn');
const Study = require('./models/Study');
const studyRoutes = require('./routes/studyRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use('/studies', studyRoutes);

conn.sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
