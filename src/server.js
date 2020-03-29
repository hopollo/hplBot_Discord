"use strict";
var express = require('express');
var path = require('path');
require('dotenv').config();
var app = express();
var router = express.Router();
var HplBot = require('./bot/utils/core/bot').HplBot;
new HplBot().start(process.env.BOT_TOKEN);
app.use(express.static('public'));
app.use('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
router.get('/try', function (req, res) {
    console.log('try request');
    res.redirect('https://discordapp.com/oauth2/authorize?client_id=682969119406293002&scope=bot');
});
router.get('/login', function (req, res) {
    console.log('login request');
    res.redirect('https://discordapp.com/api/oauth2/authorize?client_id=682969119406293002&redirect_uri=https%3A%2F%2Fhplbotdiscord.herokuapp.com%2Fcommands%2F&response_type=code&scope=identify%20guilds');
});
app.use('/commands', function (req, res) {
    console.log(req.body);
});
app.listen(process.env.PORT || 5000, function () {
    console.log('Web interface => Running...');
});
