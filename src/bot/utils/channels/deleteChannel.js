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
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var logs_1 = require("../logs/logs");
var config_json_1 = require("../../../../config.json");
var write_1 = require("../data/write");
var serverDir = path.join(__dirname, '../../../..', config_json_1.Bot_Config.Servers_Config.servers_path);
var configFile = config_json_1.Bot_Config.Servers_Config.templates.configFile;
var ChannelDeleter = /** @class */ (function () {
    function ChannelDeleter() {
    }
    ChannelDeleter.prototype.checkUsersOf = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var config, tempChannelsContainerID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new write_1.DataWriter().read(path.join(serverDir, channel.guild.id, configFile))];
                    case 1:
                        config = _a.sent();
                        tempChannelsContainerID = config.Vocals_Options.vocals_category_id;
                        if (channel.type === "voice" && channel.parentID === tempChannelsContainerID) {
                            this.deleteTempChannel(channel);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelDeleter.prototype.checkUsersBulk = function (guild) {
        var _this = this;
        guild.cache.forEach(function (g) { return __awaiter(_this, void 0, void 0, function () {
            var config, tempChannelsContainerID, tempChannel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new write_1.DataWriter().read(path.join(serverDir, g.id, configFile))];
                    case 1:
                        config = _a.sent();
                        tempChannelsContainerID = config.Vocals_Options.vocals_category_id;
                        tempChannel = g.channels.cache.filter(function (c) { return c.type === "voice" && c.parentID === tempChannelsContainerID; });
                        tempChannel.forEach(function (c) {
                            _this.deleteTempChannel(c);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ChannelDeleter.prototype.deleteTempChannel = function (target) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var config, allowDeletion, usersCount, reason, msgContent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, new write_1.DataWriter().read(path.join(serverDir, target.guild.id, configFile))];
                    case 1:
                        config = _b.sent();
                        allowDeletion = config.Vocals_Options.purge_options.purge_empty_channels;
                        if (!allowDeletion)
                            return [2 /*return*/];
                        usersCount = target.members.array().length;
                        if (usersCount !== 0 || !target.deletable)
                            return [2 /*return*/];
                        target.delete();
                        reason = 'EmptyTempChannel';
                        msgContent = config.Channels_Options.logs_channel.logs_options.channels_deletions.message
                            .replace("{{user}}", (_a = target.client.user) === null || _a === void 0 ? void 0 : _a.username)
                            .replace("{{channel}}", target.name)
                            .replace("{{reason}}", reason);
                        new logs_1.Log(target.client.user, msgContent);
                        return [2 /*return*/];
                }
            });
        });
    };
    return ChannelDeleter;
}());
exports.ChannelDeleter = ChannelDeleter;
