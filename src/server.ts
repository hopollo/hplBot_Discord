import express from 'express';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import router from './interface/routers/router';

require('dotenv').config();

const { HplBot } = require('./bot/utils/core/bot');
new HplBot().start(process.env.BOT_TOKEN);

const app = express();

app.use(helmet());

app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'interface', 'views'));
app.use(express.static(path.join(__dirname, 'interface', 'public')));


app.use(express.static(path.join(__dirname, 'interface', 'public')));

app.use('/', router);

// 404 route
app.use((req: express.Request, res: express.Response) => {
  res.status(404).render('error', {
    title: 'Error 404',
    app : `Oops ! Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>`});
});

app.listen(process.env.PORT || 5000, () => { 
  console.log('Web interface => Running...');
});