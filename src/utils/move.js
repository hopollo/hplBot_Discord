"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mover = /** @class */ (function () {
    function Mover(target, destination) {
        this._user = target;
        this._destination = destination;
        this.moveTo(this._user, this._destination);
    }
    Mover.prototype.moveTo = function (target, destination) {
        var _a;
        // Status : DISCONNECTED: 4
        if (((_a = target.voice.connection) === null || _a === void 0 ? void 0 : _a.status) !== 4)
            return target.voice.setChannel(destination);
    };
    return Mover;
}());
exports.Mover = Mover;
