"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var write_1 = require("../data/write");
var config_json_1 = require("../../../../config.json");
var puppeteer_1 = __importDefault(require("puppeteer"));
var serverDir = path_1.default.join(__dirname, '../../../..', config_json_1.Bot_Config.Servers_Config.servers_path);
var commandsFile = config_json_1.Bot_Config.Servers_Config.templates.commandsFile;
var MoobotScrapper = /** @class */ (function () {
    function MoobotScrapper(msg, url, cmd) {
        this._msg = msg;
        this._url = url;
        this._cmd = cmd;
        this.fetchBotCommands();
    }
    MoobotScrapper.prototype.fetchBotCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var getData;
            var _this = this;
            return __generator(this, function (_a) {
                getData = function () { return __awaiter(_this, void 0, void 0, function () {
                    var browser, page, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, puppeteer_1.default.launch()];
                            case 1:
                                browser = _a.sent();
                                return [4 /*yield*/, browser.newPage()];
                            case 2:
                                page = _a.sent();
                                return [4 /*yield*/, page.goto(this._url)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, page.waitForSelector('tr', { visible: true })];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, page.evaluate(function () {
                                        return Array.from(document.querySelectorAll('tr'))
                                            .map(function (i) { return i.children; })
                                            .reduce(function (a, b) { return (a['!' + b[0].innerText] = b[1].innerText.replace('/me', '').slice(1), a); }, {});
                                    })];
                            case 5:
                                result = _a.sent();
                                return [4 /*yield*/, browser.close()];
                            case 6:
                                _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                }); };
                getData()
                    .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                new write_1.DataWriter().replaceTo(path_1.default.join(serverDir, (_a = this._msg.guild) === null || _a === void 0 ? void 0 : _a.id, commandsFile), data);
                                this._msg.reactions.removeAll();
                                return [4 /*yield*/, this._msg.react("✔️")];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this._msg.reactions.removeAll();
                                return [4 /*yield*/, this._msg.react('❌')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return MoobotScrapper;
}());
exports.MoobotScrapper = MoobotScrapper;