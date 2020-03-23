"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
require('dotenv').config();
var HplBot = require('./utils/bot').HplBot;
new HplBot().start(process.env.BOT_TOKEN);
var publicPath = path_1.default.join(__dirname, '../../', 'public');
app.use(express_1.default.static('./public'));
app.use('/', function (req, res) {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
});
app.listen(process.env.PORT || 5000, function () {
    console.log('Web interface => Running...');
});
