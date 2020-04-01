"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var router_1 = __importDefault(require("./interface/routers/router"));
require('dotenv').config();
var app = express_1.default();
var HplBot = require('./bot/utils/core/bot').HplBot;
new HplBot().start(process.env.BOT_TOKEN);
app.set('views', path_1.default.join(__dirname, 'interface', 'views'));
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'interface', 'public')));
app.use(express_1.default.json());
app.use('/', router_1.default);
app.use('/try', router_1.default);
app.use('/login', router_1.default);
app.use('/commands/:user', router_1.default);
app.listen(process.env.PORT || 5000, function () {
    console.log('Web interface => Running...');
});
