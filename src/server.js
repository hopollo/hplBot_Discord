"use strict";
require('dotenv').config();
var HplBot = require('./utils/bot').HplBot;
new HplBot().start(process.env.BOT_TOKEN);
