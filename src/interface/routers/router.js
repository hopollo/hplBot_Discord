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
    res.render('index', { title: "Welcome" });
});
router.get('/try', function (req, res) {
    res.redirect("https://discordapp.com/oauth2/authorize?client_id=" + process.env.CLIENT_ID + "&scope=bot");
});
router.get('/login', function (req, res) {
    res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=" + process.env.CLIENT_ID + "&redirect_uri=" + process.env.REDIRECT_URI + "&response_type=code&scope=guilds%20identify");
});
router.get('/template', function (req, res) {
    res.redirect('https://discord.new/N3hmBUB5vqd7');
});
router.get('/callback', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, oathPath, oauth, exists, data, request, result, guilds, userData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = url_1.default.parse(req.url, true);
                if (!obj.query.code)
                    return [2 /*return*/, res.send('Error while authenticating with Discord')];
                oathPath = path_1.default.join(__dirname, '../../..', 'lib', 'oauths', obj.query.code.toString());
                exists = fs_1.default.existsSync(oathPath);
                if (!!exists) return [3 /*break*/, 2];
                data = {
                    "code": obj.query.code,
                    "redirect_uri": process.env.REDIRECT_URI,
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
                fs_1.default.writeFile(oathPath, JSON.stringify(request), function (err) {
                    if (err)
                        console.error;
                });
                oauth = request;
                return [3 /*break*/, 3];
            case 2:
                oauth = JSON.parse(fs_1.default.readFileSync(oathPath).toString());
                _a.label = 3;
            case 3: return [4 /*yield*/, node_fetch_1.default('https://discordapp.com/api/v6/users/@me', {
                    headers: {
                        authorization: oauth.token_type + " " + oauth.access_token,
                    },
                })
                    .then(function (res) { return res.json(); })
                    .catch(console.error)];
            case 4:
                result = _a.sent();
                return [4 /*yield*/, node_fetch_1.default('https://discordapp.com/api/v6/users/@me/guilds', {
                        headers: {
                            authorization: oauth.token_type + " " + oauth.access_token,
                        },
                    })
                        .then(function (res) { return res.json(); })
                        .then(function (guilds) {
                        return Object.values(guilds).filter(function (g) { return g.owner === true &&
                            fs_1.default.existsSync(path_1.default.join(__dirname, '../../..', 'lib', 'servers', g.id)) === true; });
                    })
                        .catch(console.error)];
            case 5:
                guilds = _a.sent();
                userData = {
                    title: result.username,
                    userImage: "<img src=\"https://cdn.discordapp.com/avatars/" + result.id + "/" + result.avatar + ".webp\">",
                    servers: guilds,
                    username: result.username,
                    commands: null,
                    config: null
                };
                res.render('user', userData);
                return [2 /*return*/];
        }
    });
}); });
router.get('/:guildID(\\d+)', function (req, res) {
    console.log('not auth case');
    try {
        var guildID = req.params.guildID;
        var guildPath = path_1.default.join(__dirname, '../../..', 'lib', 'servers', guildID);
        var commands = JSON.parse(fs_1.default.readFileSync(guildPath + '/commands.json', 'utf8'));
        res.render('commands', { title: guildID, commands: commands });
    }
    catch (error) {
        var data = "Sorry, Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>";
        res.status(404).render('error', { title: "Error", app: data });
    }
});
exports.default = router;
