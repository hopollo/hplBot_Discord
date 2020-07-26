import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import mongoose from 'mongoose';
import router from './interface/routers/router';

require('dotenv').config();

const { HplBot } = require('./bot/utils/core/bot');
new HplBot().start(process.env.BOT_TOKEN);

mongoose.connect(`${process.env.DB_LINK}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => console.log('Database status => Running...'));

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'interface', 'views'));
app.use(express.static(path.join(__dirname, 'interface', 'public')));

app.use('/', router);

// 404 route
app.use((req: Request, res: Response) => {
  res.status(404).render('error', {
    title: 'Error 404',
    app : `Oops ! Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>`});
});

app.listen(process.env.PORT || 5000, () => { 
  console.log('Web interface => Running...');
});