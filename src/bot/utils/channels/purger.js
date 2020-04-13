"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs_1 = require("../logs/logs");
var Purger = /** @class */ (function () {
    function Purger(initiator, source, length) {
        this.purge(initiator, source, length);
    }
    Purger.prototype.purge = function (initiator, source, length) {
        if (!initiator.hasPermission('MANAGE_CHANNELS') && length > 10)
            return initiator.send("Security stop : Only administrators can purge more than 10 messages.");
        if (initiator.hasPermission('ADMINISTRATOR') && length > 100)
            return initiator.send("Bulk size too hight, aim from 1 to 100 messages max per chunks");
        source.bulkDelete(length, true)
            .then(function () {
            var msgContent = initiator.displayName + " Purged : **" + source.name + "** (Length: " + length + ")";
            new logs_1.Log(initiator.user, msgContent);
        })
            .catch(function (err) {
            initiator.send("Error while trying to purge **" + source.name + "**: *" + err.message + "*.");
        });
    };
    return Purger;
}());
exports.Purger = Purger;
