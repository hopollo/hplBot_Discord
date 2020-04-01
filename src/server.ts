import express from 'express';
import path from 'path';
import router from './interface/routers/router';

require('dotenv').config();

const app = express();

const { HplBot } = require('./bot/utils/core/bot');
new HplBot().start(process.env.BOT_TOKEN);

app.set('views', path.join(__dirname, 'interface', 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'interface', 'public')));

app.use(express.json());

app.use('/', router);
app.use('/try', router);
app.use('/login', router);
app.use('/commands/:user', router);

app.listen(process.env.PORT || 5000, () => { 
  console.log('Web interface => Running...');
});