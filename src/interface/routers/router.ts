import { Router } from 'express';
import url, { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { Guild } from 'discord.js';

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
        <a href="https://discordapp.com/api/oauth2/authorize?client_id=682969119406293002&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=guilds%20identify" title="Connect"><button class="loginButton">LOG IN</button></a>
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
  const oathPath = path.join(__dirname, '../../..', 'lib', 'oauths', obj.query.code.toString());

  let oauth;

  const exists = fs.existsSync(oathPath);
  if (!exists) {
    const data = {
      "code" : obj.query.code,
      "redirect_uri" : process.env.REDIRECT_URI,
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

    fs.writeFile(oathPath, JSON.stringify(request), (err) => {
      if (err) console.error;
    });

    oauth = request;
  } else {
    oauth = JSON.parse(fs.readFileSync(oathPath).toString());
  }

  const result = await fetch('https://discordapp.com/api/v6/users/@me', {
		headers: {
			authorization: `${oauth.token_type} ${oauth.access_token}`,
		},
	})
  .then(res => res.json())
  .catch(console.error);

  const guilds = await fetch('https://discordapp.com/api/v6/users/@me/guilds', {
    headers: {
			authorization: `${oauth.token_type} ${oauth.access_token}`,
		},
  })
  .then(res => res.json())
  .then(guilds => {
    return Object.values(guilds).filter((g: any) => g.owner === true && 
            fs.existsSync(path.join(__dirname, '../../..', 'lib', 'servers', g.id)) === true);

  })
  .catch(console.error);

  const userData = {
    title: result.username,
    userImage: `<img src="https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}.webp">`,
    servers: guilds,
    username: result.username,
    commands: {},
    config: {}
  }

  res.render('user', userData);

  //res.redirect(`/${result.username.toLowerCase()}`);
});

router.get('/:guildID(\\d+)', async (req, res) => {
  try {
    const guildID = req.params.guildID;

    const guildPath = path.join(__dirname, '../../..', 'lib', 'servers', guildID);

    const config = JSON.parse(fs.readFileSync(guildPath + '/config.json', 'utf8'));
    const commands = JSON.parse(fs.readFileSync(guildPath + '/commands.json', 'utf8'));

    res.status(200).render('./components/guildData', { config, commands });
  } catch (error) {
    
    const data = `Sorry, Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>`;
    res.status(404).render('error', { title: "Error", app: data });
  }
});

export default router;