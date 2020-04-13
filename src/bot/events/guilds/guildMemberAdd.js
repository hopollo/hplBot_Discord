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
var config_json_1 = require("../../../../config.json");
var path_1 = __importDefault(require("path"));
var logs_1 = require("../../utils/logs/logs");
var write_1 = require("../../utils/data/write");
function guildMemberAdd(member) {
    return __awaiter(this, void 0, void 0, function () {
        var serverDir, configFile, config, allowWelcome, allowLogs, channel, welcomeMsg, author, msgContent, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    serverDir = path_1.default.join(__dirname, '../../../..', config_json_1.Bot_Config.Servers_Config.servers_path);
                    configFile = config_json_1.Bot_Config.Servers_Config.templates.configFile;
                    return [4 /*yield*/, new write_1.DataWriter().read(path_1.default.join(serverDir, member.guild.id, configFile))];
                case 1:
                    config = _a.sent();
                    allowWelcome = config.Channels_Options.welcome_channel.allow_welcome;
                    allowLogs = config.Channels_Options.logs_channel.logs_options.server_joins.enabled;
                    if (!allowWelcome)
                        return [2 /*return*/, undefined];
                    channel = member.guild.systemChannel;
                    welcomeMsg = config.Channels_Options.welcome_channel.welcome_message
                        .replace('{{user}}', member.user.username)
                        .repalce('{{server}}', member.guild.name);
                    return [4 /*yield*/, channel.send(welcomeMsg)];
                case 2:
                    _a.sent();
                    if (!allowLogs)
                        return [2 /*return*/, undefined];
                    author = member.user.username;
                    msgContent = config.Channels_Options.logs_channel.logs_options.server_joins.message
                        .replace('{{user}}', author);
                    new logs_1.Log(member.user, msgContent);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.guildMemberAdd = guildMemberAdd;
