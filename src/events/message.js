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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var config_json_1 = require("../../config.json");
var logs_1 = require("../utils/logs");
var createChannel_1 = require("../utils/createChannel");
var serverDir = path_1.default.join(__dirname, '../..', config_json_1.Bot_Config.Servers_Config.servers_path);
var configFile = config_json_1.Bot_Config.Servers_Config.templates.configFile;
var commandsFile = config_json_1.Bot_Config.Servers_Config.templates.commandsFile;
function message(msg) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        function compareCommands(fetch) {
            return __awaiter(this, void 0, void 0, function () {
                var commands, result, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path_1.default.join(serverDir, msg.guild.id, commandsFile))); })];
                        case 1:
                            commands = _a.sent();
                            return [4 /*yield*/, commands.hasOwnProperty(msgContent)];
                        case 2:
                            result = _a.sent();
                            if (!result) return [3 /*break*/, 4];
                            return [4 /*yield*/, commands[msgContent]];
                        case 3:
                            response = _a.sent();
                            return [2 /*return*/, msg.reply(response)];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        var stableMode, authorUsername, msgContent, commandsPrefix, config, customCommand, slots, customChannelsNamesTemplate;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    stableMode = config_json_1.Bot_Config.stable_mode.enabled;
                    authorUsername = msg.author.username;
                    msgContent = msg.content.toLowerCase();
                    commandsPrefix = config_json_1.Bot_Config.commands_prefix || '!';
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path_1.default.join(serverDir, (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id, configFile))); })];
                case 1:
                    config = _b.sent();
                    customCommand = config.Vocals_Options.creation_command;
                    if (msg.author.bot || !msgContent.startsWith(commandsPrefix))
                        return [2 /*return*/, undefined];
                    if (!stableMode)
                        return [2 /*return*/, msg.reply('Maintenance en cours du bot, merci de réessayer plus tard.')];
                    // Create custom size vocals feature
                    if (msgContent.includes(customCommand)) {
                        slots = msgContent.replace(customCommand, '');
                        customChannelsNamesTemplate = config.Vocals_Options.custom_vocals_titles
                            .replace('{{slots}}', slots)
                            .replace('{{user}}', authorUsername);
                        return [2 /*return*/, new createChannel_1.ChannelCreator(msg, customChannelsNamesTemplate, +slots)];
                    }
                    switch (msgContent) {
                        case '!log':
                            new logs_1.Log(msg.author, msgContent);
                            break;
                        case '!hplBot':
                            msg.reply('Mon site : https://hopollo.netlify.com/');
                            break;
                        case '!help':
                            msg.reply('HplBot Commands : https://www.hplbot.com/discord/commands/hplbot');
                            break;
                        case '!hplbot':
                            msg.reply('HplBot est un bot discord et twitch, créer par @HoPolloTV');
                            break;
                        case '!solo':
                            new createChannel_1.ChannelCreator(msg, authorUsername + " Solo", 1);
                            break;
                        case '!duo':
                            new createChannel_1.ChannelCreator(msg, authorUsername + " Duo", 2);
                            break;
                        case '!trio':
                            new createChannel_1.ChannelCreator(msg, authorUsername + " Trio", 3);
                            break;
                        case '!squad':
                            new createChannel_1.ChannelCreator(msg, authorUsername + " Squad", 5);
                            break;
                        default:
                            compareCommands(true);
                            break;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.message = message;
