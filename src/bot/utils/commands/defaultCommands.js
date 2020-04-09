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
var discord_js_1 = require("discord.js");
var config_json_1 = require("../../../../config.json");
var path_1 = __importDefault(require("path"));
var createChannel_1 = require("../channels/createChannel");
var write_1 = require("../data/write");
var scrapper_1 = require("../scrapper/scrapper");
var serverDir = path_1.default.join(__dirname, '../../../..', config_json_1.Bot_Config.Servers_Config.servers_path);
var configFile = config_json_1.Bot_Config.Servers_Config.templates.configFile;
var commandFile = config_json_1.Bot_Config.Servers_Config.templates.commandsFile;
var Command = /** @class */ (function () {
    function Command(msg) {
        this._msg = msg;
        this._content = msg.content;
        this._cmd = this._content.toLowerCase().split(' ')[0];
        this._args = this._content.split(' ').slice(1);
        this.commandsFilePath = path_1.default.join(serverDir, msg.guild.id, commandFile);
        this.processMsg(this._msg);
    }
    Command.prototype.processMsg = function (msg) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, customCommand;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this;
                        return [4 /*yield*/, new write_1.DataWriter().read(path_1.default.join(serverDir, (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id, configFile))];
                    case 1:
                        _b._cfg = _c.sent();
                        customCommand = this._cfg.Vocals_Options.creation_command;
                        switch (this._cmd) {
                            case '!addcom':
                                this.addCom(this._content);
                                break;
                            case '!editcom':
                                this.editCom(this._content);
                                break;
                            case '!delcom':
                                this.delCom(this._content);
                                break;
                            case '!duo':
                                new createChannel_1.ChannelCreator(this._msg, 2);
                                break;
                            case '!trio':
                                new createChannel_1.ChannelCreator(this._msg, 3);
                                break;
                            case '!squad':
                                new createChannel_1.ChannelCreator(this._msg, 5);
                                break;
                            case '!help':
                                this.help();
                                break;
                            case customCommand:
                                this.customChannel(this._cmd, +this._args);
                                break;
                            case '!scrap':
                                this.fecthBotCommmands();
                                break;
                            default:
                                this.fecthCommand(this._msg);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Command.prototype.fecthCommand = function (msg) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var unknownCommand, unknownCommandMessage, response, msgContent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = msg.member) === null || _a === void 0 ? void 0 : _a.hasPermission("MANAGE_GUILD")))
                            return [2 /*return*/, msg.reply("Sorry, you'r not allowed.")];
                        unknownCommand = this._cfg.Commands_Options.enabled;
                        unknownCommandMessage = this._cfg.Commands_Options.message;
                        return [4 /*yield*/, new write_1.DataWriter().findInto(this.commandsFilePath, this._cmd)];
                    case 1:
                        response = _b.sent();
                        if (response)
                            return [2 /*return*/, msg.reply(response)];
                        if (unknownCommand) {
                            msgContent = unknownCommandMessage
                                .replace('{{command}}', this._cmd);
                            this._msg.reply(msgContent);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Command.prototype.fecthBotCommmands = function () {
        new scrapper_1.Scrapper(this._msg, this._msg.guild.id, this._cmd);
    };
    Command.prototype.help = function () {
        var helpEmbed = new discord_js_1.MessageEmbed()
            .setAuthor('HplBot Commands :')
            .addField('Create a command, overrides existing from (!scrap)', '!addcom !hi Hello there')
            .addField('Edit a command', '!editcom !hi Bonjour !')
            .addField('Delete a command', '!delcom !hi')
            //.addField('Always ignore a command from (!scrap)', '!bancom !setgame')
            //.addField('Protects a command from override with (!scrap)', '!lockcom !followage')
            .addField('Copy all twitch chat bot commands & override currents', '!scrap')
            .addField('Creates a channel', '!duo, !trio, !squad, !custom NUMBER')
            .setFooter('more info on twitter @HoPolloTV');
        this._msg.reply(helpEmbed);
    };
    Command.prototype.addCom = function (args) {
        var _a;
        var _b;
        if (!((_b = this._msg.member) === null || _b === void 0 ? void 0 : _b.hasPermission('MANAGE_GUILD')))
            return;
        var match = args.match(/^(!\w+)\s(!\w+)\s(.*)/);
        var command = match[2];
        var resp = match[3];
        var data = (_a = {}, _a[command] = resp, _a);
        new write_1.DataWriter().appendTo(this.commandsFilePath, data);
    };
    Command.prototype.editCom = function (args) {
        var _a;
        var _b;
        if (!((_b = this._msg.member) === null || _b === void 0 ? void 0 : _b.hasPermission('MANAGE_GUILD')))
            return;
        var match = args.match(/^(!\w+)\s(!\w+)\s(.*)/);
        var command = match[2];
        var resp = match[3];
        var data = (_a = {}, _a[command] = resp, _a);
        new write_1.DataWriter().appendTo(this.commandsFilePath, data);
    };
    Command.prototype.delCom = function (args) {
        var _a;
        if (!((_a = this._msg.member) === null || _a === void 0 ? void 0 : _a.hasPermission('MANAGE_GUILD')))
            return;
        var match = args.match(/^(!\w+)\s(!\w+)/);
        var command = match[2];
        new write_1.DataWriter().removeTo(this.commandsFilePath, command);
    };
    Command.prototype.customChannel = function (cmd, slots) {
        new createChannel_1.ChannelCreator(this._msg, slots);
    };
    return Command;
}());
exports.Command = Command;
