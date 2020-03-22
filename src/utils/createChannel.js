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
var write_1 = require("../utils/write");
var config_json_1 = require("../../config.json");
var logs_1 = require("./logs");
var move_1 = require("./move");
var createInvite_1 = require("./createInvite");
var ChannelCreator = /** @class */ (function () {
    function ChannelCreator(msg, name, slots) {
        this._name = name;
        this._slots = slots;
        this._msg = msg;
        this.createNewVoiceChannel(this._msg, this._name, this._slots);
    }
    ChannelCreator.prototype.createNewVoiceChannel = function (msg, channelName, slotsLimit) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var config, tempChannels, vocalsContainerID, vocalsMaxSlots, reachedMessage, deleteCreationCommand, msgDeleteIdle, moveCreator, shareInvite, allowLogs, newChannel, msgContent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path_1.default.join(__dirname, '../..', config_json_1.Bot_Config.Servers_Config.servers_path, msg.guild.id, config_json_1.Bot_Config.Servers_Config.templates.configFile))); })];
                    case 1:
                        config = _b.sent();
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path_1.default.join(__dirname, '../..', config_json_1.Bot_Config.Servers_Config.servers_path, msg.guild.id, config_json_1.Bot_Config.Servers_Config.templates.tempChannelsFile))); })];
                    case 2:
                        tempChannels = _b.sent();
                        vocalsContainerID = config.Vocals_Options.vocals_category_id;
                        vocalsMaxSlots = config.Vocals_Options.max_users.count;
                        reachedMessage = config.Vocals_Options.max_users.reached_message;
                        deleteCreationCommand = config.Vocals_Options.purge_options.purge_creation_commands;
                        msgDeleteIdle = config.Vocals_Options.purge_options.purge_creation_commands_idle;
                        moveCreator = config.Vocals_Options.move_creator_inside;
                        shareInvite = config.Channels_Options.invites_channel.post_invite_links;
                        allowLogs = config.Channels_Options.logs_options.channels_creations.enabled;
                        // Issues & security tweaks for custom numbers especially
                        if (isNaN(slotsLimit))
                            return [2 /*return*/, undefined];
                        if (slotsLimit >= vocalsMaxSlots)
                            return [2 /*return*/, msg.reply(reachedMessage)];
                        return [4 /*yield*/, ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.channels.create(channelName, {
                                type: 'voice',
                                userLimit: slotsLimit,
                                // REMARK : Huge issue there, there's no way to convert channel id to "1615616",
                                // the only way to makes it works is to set the "" manually inside the config line
                                // it's never working otherwise, is it a lib issue ??
                                parent: vocalsContainerID
                            }).catch(console.error))];
                    case 3:
                        newChannel = _b.sent();
                        // Delete the command msg for clearance
                        if (deleteCreationCommand)
                            msg.delete({ timeout: msgDeleteIdle });
                        if (shareInvite) {
                            new createInvite_1.CreateInvite(newChannel);
                        }
                        else {
                            // Add both to use them for deletions after
                            new write_1.DataWriter().appendTo(tempChannels, { channelID: newChannel.id, inviteID: null });
                        }
                        // Moves the user into his new temporary channel feature
                        if (moveCreator)
                            new move_1.Mover(msg.member, newChannel);
                        msgContent = config.Channels_Options.logs_channel.logs_options.channels_creations.message
                            .replace('{{user}}', msg.author.username)
                            .replace('{{channel}}', newChannel.name);
                        if (allowLogs)
                            new logs_1.Log(msg.client.user, msgContent);
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return ChannelCreator;
}());
exports.ChannelCreator = ChannelCreator;
