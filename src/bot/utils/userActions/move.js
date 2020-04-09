"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mover = /** @class */ (function () {
    function Mover(target, destination) {
        this._user = target;
        this._destination = destination;
        this.moveTo(this._user, this._destination);
    }
    Mover.prototype.moveTo = function (target, destination) {
        /* Status:
        CONNECTED: 0
        CONNECTING: 1
        AUTHENTICATING: 2
        RECONNECTING: 3
        DISCONNECTED: 4
        */
        if (target.voice.connection.status === 0) {
            target.voice.setChannel(destination, 'Moved to own temp channel').catch(console.error);
        }
    };
    return Mover;
}());
exports.Mover = Mover;
