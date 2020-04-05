"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var router_1 = __importDefault(require("./interface/routers/router"));
require('dotenv').config();
var app = express_1.default();
/*
const { HplBot } = require('./bot/utils/core/bot');
new HplBot().start(process.env.BOT_TOKEN);
*/
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'interface', 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'interface', 'public')));
app.use(express_1.default.json());
app.use(morgan_1.default('dev'));
app.use('/', router_1.default);
app.use('/callback/:code', router_1.default);
app.use('/:guild', router_1.default);
// 404 route
app.use('*', function (req, res) {
    var data = "Sorry, Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>";
    res.status(404).render('error', { title: "Error", app: data });
});
app.listen(process.env.PORT || 5000, function () {
    console.log('Web interface => Running...');
});
