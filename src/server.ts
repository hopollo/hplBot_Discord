require('dotenv').config();
const { HplBot } = require('./utils/bot');

new HplBot().start(process.env.BOT_TOKEN);