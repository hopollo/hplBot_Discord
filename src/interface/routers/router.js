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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var url_1 = __importStar(require("url"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
require('dotenv').config();
var router = express_1.Router();
router.get('/', function (req, res) {
    var data = "\n  <div class=\"top\">\n    <div class=\"header\">\n      <main>\n        <h1><p><span>HplBot</span></p> <span>for</span> <span>Discord</span> <span>!</span></h1>\n      </main>\n      <div class=\"controls\">\n        <a href=\"https://discordapp.com/oauth2/authorize?client_id=682969119406293002&scope=bot\" title=\"Call it\"><button class=\"getItButton\">GET IT</button></a>\n        <a href=\"https://discordapp.com/api/oauth2/authorize?client_id=682969119406293002&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&response_type=code&scope=guilds%20identify\" title=\"Connect\"><button class=\"loginButton\">LOG IN</button></a>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"center\">\n    <ul class=\"features\">\n      <li>Automaticly use Twitch bot commands</li>\n      <li>Get usefull logs in dedicated log channel</li>\n      <li>Hplbot will always be <strong>Free</strong></li>\n      <li>Open-source project</li>\n      <li>Self-hosted, ready to use</li>\n      <li>One-click setup</li>\n      <li>Phrase customizations</li>\n      <li>Manage roles</li>\n      <li>Manage channels</li>\n      <li>Creates temporary channels</li>\n      <li>Clears temporary channels when empty</li>\n    </ul>\n  </div>\n  ";
    res.render('index', { title: "Welcome", app: data });
});
router.get('/callback', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, data, request, result, guilds, htmlData, userData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = url_1.default.parse(req.url, true);
                if (!obj.query.code)
                    return [2 /*return*/, res.send('Error while authenticating with Discord')];
                data = {
                    "code": obj.query.code,
                    "redirect_uri": "http://localhost:5000/callback",
                    "grant_type": "authorization_code",
                    "client_id": process.env.CLIENT_ID,
                    "client_secret": process.env.CLIENT_SECRET,
                    "scope": "Identify guilds",
                };
                return [4 /*yield*/, node_fetch_1.default('https://discordapp.com/api/oauth2/token', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: new url_1.URLSearchParams(data),
                        redirect: "follow"
                    })
                        .then(function (res) { return res.json(); })
                        .catch(function (err) { return res.send(err); })];
            case 1:
                request = _a.sent();
                return [4 /*yield*/, node_fetch_1.default('https://discordapp.com/api/v6/users/@me', {
                        headers: {
                            authorization: request.token_type + " " + request.access_token,
                        },
                    })
                        .then(function (res) { return res.json(); })
                        .catch(console.error)];
            case 2:
                result = _a.sent();
                return [4 /*yield*/, node_fetch_1.default('https://discordapp.com/api/v6/users/@me/guilds', {
                        headers: {
                            authorization: request.token_type + " " + request.access_token,
                        },
                    })
                        .then(function (res) { return res.json(); })
                        // TODO: Sort by name alphabetic
                        .then(function (guilds) { return Array.from(guilds).filter(function (g) { return g.owner === true; }); })
                        // TODO: Exclude owned guilds that are not "servers" of hplBot
                        /*
                        .then((ownedGuilds: any) => {
                          let server = [];
                          const exists = fs.existsSync(path.join(__dirname, '../../..', 'lib', 'servers', ownedGuilds.id))
                          if (!exists) return;
                          server.push(ownedGuilds);
                        })
                        */
                        .catch(console.error)];
            case 3:
                guilds = _a.sent();
                htmlData = "\n    <div class=\"controls\">\n      <button class=\"default\">COMMANDS</button>\n      <button class=\"default\">CONFIG</button>\n    </div>\n  ";
                userData = {
                    title: result.username,
                    userImage: "<img src=\"https://cdn.discordapp.com/avatars/" + result.id + "/" + result.avatar + ".webp\">",
                    servers: guilds,
                    username: result.username,
                    app: htmlData
                };
                res.render('user', userData);
                return [2 /*return*/];
        }
    });
}); });
router.get('/:guildID', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var guildID, guildPath, config, commands;
    return __generator(this, function (_a) {
        guildID = req.params.guildID;
        guildPath = path_1.default.join(__dirname, '../../..', 'lib', 'servers', guildID);
        config = JSON.parse(fs_1.default.readFileSync(guildPath + '/config.json', 'utf8'));
        commands = JSON.parse(fs_1.default.readFileSync(guildPath + '/commands.json', 'utf8'));
        res.json({ config: config, commands: commands });
        return [2 /*return*/];
    });
}); });
exports.default = router;
