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
var logs_1 = require("../logs/logs");
var PunishHandler = /** @class */ (function () {
    // TODO : HoPollo, replace type with proper list
    function PunishHandler(initiator, target, type, time, reason, source) {
        this._initiator = initiator;
        this._target = target;
        this._time = time;
        this._reason = reason;
        switch (type) {
            case 'mute':
                this.mute();
                break;
            case 'unmute':
                this.unmute();
                break;
            case 'ban':
                this.ban();
                break;
            case 'kick':
                this.unban();
                break;
            case 'unban':
                this.unban();
                break;
            case 'eject':
                this.eject();
                break;
            default:
                console.error("Error : Unkown Pusnish type (" + type + ")");
                break;
        }
    }
    PunishHandler.prototype.mute = function () { };
    PunishHandler.prototype.unmute = function () { };
    PunishHandler.prototype.ban = function () {
        var _this = this;
        if (!this._initiator.hasPermission('BAN_MEMBERS') &&
            !this._target.bannable)
            return undefined;
        this._target.ban({ days: this._time, reason: this._reason })
            .then(function () {
            var msgContent = 'Banned';
            // TODO (hopollo) : purge all his past msg option
            new logs_1.Log(_this._initiator.user, msgContent);
        })
            .catch(function (err) {
            _this._initiator.send("Error while trying to ban **" + _this._target + "**: *" + err.message + "*, Maybe try it from Discord.");
        });
    };
    PunishHandler.prototype.unban = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this._initiator.hasPermission('BAN_MEMBERS'))
                    return [2 /*return*/, undefined];
                return [2 /*return*/];
            });
        });
    };
    PunishHandler.prototype.eject = function () { };
    PunishHandler.prototype.kick = function () {
        var _this = this;
        if (!this._initiator.hasPermission('KICK_MEMBERS') ||
            !this._initiator.hasPermission('BAN_MEMBERS') &&
                !this._target.kickable)
            return undefined;
        this._target.kick(this._reason)
            .then(function () {
            var msgContent = 'Kicked';
            new logs_1.Log(_this._initiator.user, msgContent);
        })
            .catch(function (err) {
            _this._initiator.send("Error while trying to kick **" + _this._target + "**: *" + err.message + "*, Maybe try it from Discord.");
        });
    };
    return PunishHandler;
}());
exports.PunishHandler = PunishHandler;
