import express from 'express';
import morgan from 'morgan';
import path from 'path';
import router from './interface/routers/router';


require('dotenv').config();

const app = express();

/*
const { HplBot } = require('./bot/utils/core/bot');
new HplBot().start(process.env.BOT_TOKEN);
*/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'interface', 'views'));

app.use(express.static(path.join(__dirname, 'interface', 'public')));

app.use(express.json());

app.use(morgan('dev'));

app.use('/', router);
app.use('/callback/:code', router);
app.use('/:guild', router);

// 404 route
app.use('*', (req, res) => {
  const data = `Sorry, Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>`;
  res.status(404).render('error', { title: "Error", app: data });
});

app.listen(process.env.PORT || 5000, () => { 
  console.log('Web interface => Running...');
});