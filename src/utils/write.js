"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var config_json_1 = require("../../config.json");
var serverDir = config_json_1.Bot_Config.Servers_Config.servers_path;
var DataWriter = /** @class */ (function () {
    function DataWriter() {
    }
    DataWriter.prototype.replaceTo = function (filePath, data) {
        fs_1.default.writeFile(filePath, JSON.stringify(data), function (err) {
            if (err)
                return console.error(err);
        });
    };
    DataWriter.prototype.appendTo = function (filePath, data) {
        // TODO: NOT FINISHED
        fs_1.default.readFile(filePath, function (err, json) {
            if (err)
                return console.error;
            //Generate default + adds data to it
            if (!json)
                return fs_1.default.appendFile(filePath, JSON.stringify(data), function (err) {
                    if (err)
                        console.error;
                });
            var array = JSON.parse(json.toString());
            array.push(data);
            fs_1.default.writeFile(filePath, JSON.stringify(array), function (err) {
                if (err)
                    return console.error(err);
            });
        });
    };
    DataWriter.prototype.removeTo = function (filePath, data) {
        fs_1.default.readFile(filePath, function (err, json) {
            if (err)
                return console.error;
            if (!json)
                return console.error(new Error(filePath + " : No data inside"));
            var array = JSON.parse(json.toString());
            var index = array.indexOf(data);
            if (index > -1)
                array.splice(index, 1);
            fs_1.default.writeFile(filePath, JSON.stringify(array), function (err) {
                if (err)
                    return console.error(err);
            });
        });
    };
    return DataWriter;
}());
exports.DataWriter = DataWriter;
