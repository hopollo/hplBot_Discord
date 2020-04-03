import { Router } from 'express';
import url, { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

require('dotenv').config();

const router = Router();

router.get('/', (req, res) => {
  const data = 
  `
  <div class="top">
    <div class="header">
      <main>
        <h1><p><span>HplBot</span></p> <span>for</span> <span>Discord</span> <span>!</span></h1>
      </main>
      <div class="controls">
        <a href="https://discordapp.com/oauth2/authorize?client_id=682969119406293002&scope=bot" title="Call it"><button class="getItButton">GET IT</button></a>
        <a href="https://discordapp.com/api/oauth2/authorize?client_id=682969119406293002&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&response_type=code&scope=guilds%20identify" title="Connect"><button class="loginButton">LOG IN</button></a>
      </div>
    </div>
  </div>

  <div class="center">
    <ul class="features">
      <li>Automaticly use Twitch bot commands</li>
      <li>Get usefull logs in dedicated log channel</li>
      <li>Hplbot will always be <strong>Free</strong></li>
      <li>Open-source project</li>
      <li>Self-hosted, ready to use</li>
      <li>One-click setup</li>
      <li>Phrase customizations</li>
      <li>Manage roles</li>
      <li>Manage channels</li>
      <li>Creates temporary channels</li>
      <li>Clears temporary channels when empty</li>
    </ul>
  </div>
  `

  res.render('index', { title: "Welcome", app: data });
});

router.get('/callback', async (req, res) => {
  const obj = url.parse(req.url, true);

  if (!obj.query.code) return res.send('Error while authenticating with Discord');

  const data = {
    "code" : obj.query.code,
    "redirect_uri" : "http://localhost:5000/callback",
    "grant_type" : "authorization_code",
    "client_id" : process.env.CLIENT_ID,
    "client_secret" : process.env.CLIENT_SECRET,
    "scope" : "Identify guilds",
  }

  const request = await fetch('https://discordapp.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(data),
    redirect: "follow"
  })
  .then(res => res.json())
  .catch(err => res.send(err));

  //TODO (hopollo) : Try to implement somthing to avoid reOauth all the time
  //console.log(request);

  /*
  fs.writeFile(path.join(__dirname, '../../..', 'lib', 'oauths'), requestData, (err) => {
    if (err) console.error;
  });
  */

  const result = await fetch('https://discordapp.com/api/v6/users/@me', {
		headers: {
			authorization: `${request.token_type} ${request.access_token}`,
		},
	})
  .then(res => res.json())
  .catch(console.error);

  const guilds = await fetch('https://discordapp.com/api/v6/users/@me/guilds', {
    headers: {
			authorization: `${request.token_type} ${request.access_token}`,
		},
  })
  .then(res => res.json())
  // TODO: Sort by name alphabetic
  .then(guilds => Array.from(guilds).filter((g: any) => g.owner === true))
  // TODO: Exclude owned guilds that are not "servers" of hplBot
  /*
  .then((ownedGuilds: any) => {
    let server = [];
    const exists = fs.existsSync(path.join(__dirname, '../../..', 'lib', 'servers', ownedGuilds.id))
    if (!exists) return;
    server.push(ownedGuilds);
  })
  */
  .catch(console.error);

  const htmlData = `
    <div class="controls">
      <button class="default">COMMANDS</button>
      <button class="default">CONFIG</button>
    </div>
  `;

  const userData = {
    title: result.username,
    userImage: `<img src="https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}.webp">`,
    servers: guilds,
    username: result.username,
    app: htmlData,
    styleEl: 'display { none }'
  }

  res.render('user', userData);

  //res.redirect(`/${result.username.toLowerCase()}`);
});

router.get('/:guildID', async (req, res) => {
  const guildID = req.params.guildID;

  const guildPath = path.join(__dirname, '../../..', 'lib', 'servers', guildID);

  const config = JSON.parse(fs.readFileSync(guildPath + '/config.json', 'utf8'));
  const commands = JSON.parse(fs.readFileSync(guildPath + '/commands.json', 'utf8'));
  
  res.json({config, commands});
});

export default router;