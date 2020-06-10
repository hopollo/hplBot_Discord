"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var helmet_1 = __importDefault(require("helmet"));
var router_1 = __importDefault(require("./interface/routers/router"));
require('dotenv').config();
var HplBot = require('./bot/utils/core/bot').HplBot;
new HplBot().start(process.env.BOT_TOKEN);
var app = express_1.default();
app.use(helmet_1.default());
app.use(morgan_1.default('dev'));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'interface', 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'interface', 'public')));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use('/', router_1.default);
// 404 route
app.use(function (req, res) {
    res.status(404).render('error', {
        title: 'Error 404',
        app: "Oops ! Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>"
    });
});
app.listen(process.env.PORT || 5000, function () {
    console.log('Web interface => Running...');
    //Anti Travis Idle
    setInterval(function () {
        console.log("Avoiding idle");
    }, 5 * 60 * 1000);
});
