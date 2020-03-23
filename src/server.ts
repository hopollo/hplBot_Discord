import express from 'express';
import path from 'path';
const app = express();

require('dotenv').config();
const { HplBot } = require('./utils/bot');

new HplBot().start(process.env.BOT_TOKEN);

const publicPath = path.join(__dirname, '../../', 'public');

app.use(express.static('./public'));

app.use('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(process.env.PORT || 5000, () => { 
  console.log('Web interface => Running...');
});