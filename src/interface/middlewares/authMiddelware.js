"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
function mdLog(req, res, next) {
    var _a;
    var code = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('?code=')[1];
    var authPath = path_1.default.join(__dirname, '../../..', 'lib', 'oauths');
    var exists = fs_1.existsSync(authPath + '/' + code);
    if (exists)
        return next();
    res.status(404).json('Acces denied');
}
exports.default = mdLog;
