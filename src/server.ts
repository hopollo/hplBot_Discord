const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();
const router = express.Router();


const { HplBot } = require('./bot/utils/core/bot');
new HplBot().start(process.env.BOT_TOKEN);

app.use(express.static('public'));

app.use('/', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.get('/try', (req: any, res: any) => {
  console.log('try request');
  res.redirect('https://discordapp.com/oauth2/authorize?client_id=682969119406293002&scope=bot');
});

router.get('/login', (req: any, res: any) => {
  console.log('login request');
  res.redirect('https://discordapp.com/api/oauth2/authorize?client_id=682969119406293002&redirect_uri=https%3A%2F%2Fhplbotdiscord.herokuapp.com%2Fcommands%2F&response_type=code&scope=identify%20guilds');
});

app.use('/commands', (req: any, res: any) => {
  console.log(req.body);
});

app.listen(process.env.PORT || 5000, () => { 
  console.log('Web interface => Running...');
});