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

  res.render('layout', { title: "Welcome", app: data });
});

router.get('/try', (req, res) => {
  console.log('try');
  res.redirect('https://discordapp.com/oauth2/authorize?client_id=682969119406293002&scope=bot');
});

router.get('/login', (req, res) => {
  console.log('login');
  res.redirect('https://discordapp.com/api/oauth2/authorize?client_id=682969119406293002&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&response_type=code&scope=identify%20guilds');
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

  const result = await fetch('https://discordapp.com/api/v6/users/@me', {
		headers: {
			authorization: `${request.token_type} ${request.access_token}`,
		},
	})
  .then(res => res.json())
  .catch(console.error);

  /* TODO: Fix Auth issue
  const user = await fetch(`https://discordapp.com/api/v6/users/${result.id}`, {
    headers: {
			authorization: `${request.token_type} ${request.access_token}`,
		},
  })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
  */

  const guilds = await fetch('https://discordapp.com/api/v6/users/@me/guilds', {
    headers: {
			authorization: `${request.token_type} ${request.access_token}`,
		},
  })
  .then(res => res.json())
  // TODO: Sort by name alphabetic
  .then(guilds => Array.from(guilds).filter((g: any) => g.owner === true))
  .catch(console.error);

  const htmlData = `
    <h1>Hey ${result.username} !</h1>
    <p>this page is still under construction, stay tuned !</p>
  `;

  const userData = {
    title: result.username,
    userImage: `<img src="https://cdn.discordapp.com/${result.avatar}.png">`,
    servers: guilds,
    username: result.username,
    app: htmlData
  }

  res.render('user', userData);

  //res.redirect(`/${result.username.toLowerCase()}`);
});

/*
router.get('/:user', (req, res) => {
  res.render('user');
});
*/

router.get('/guild/:guildID/:type', async (req, res) => {
  const guildID = req.params.guildID;
  const reqType = req.params.type;

  const guildPath = path.join(__dirname, '../../..', 'lib', 'servers', guildID);

  if (reqType == 'config') {
    const config = fs.createReadStream(guildPath + '/config.json');

    config.on('data', (chunck) => {
      config.pipe(res.json(JSON.parse(chunck)));
    });

    config.on('error', (err) => {
      res.end(err);
    });
  } 
  else {
    const commands = fs.createReadStream(guildPath + '/commands.json');

    commands.on('data', (chunk) => {
      commands.pipe(res.json(JSON.parse(chunk)));
    });
  
    commands.on('error', (err) => {
      res.end(err);
    });
  }  
});

export default router;