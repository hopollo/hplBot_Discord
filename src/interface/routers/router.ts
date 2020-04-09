import { Router } from 'express';
import url, { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

require('dotenv').config();

const router = Router();

router.get('/', (req, res) => {
  res.render('index', { title: "Welcome" });
});

router.get('/try', (req, res) => {
  res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot`);
});

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=guilds%20identify`);
});

router.get('/template', (req, res) => {
  res.redirect('https://discord.new/N3hmBUB5vqd7');
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
    commands: null,
    config: null
  }

  res.render('user', userData);

  // res.redirect(`/user/${result.username.toLowerCase()}`);
});

router.get('/:guildID(\\d+)', (req, res) => {
  console.log('not auth case');
  try {
    const guildID = req.params.guildID;
    const guildPath = path.join(__dirname, '../../..', 'lib', 'servers', guildID);
    const commands = JSON.parse(fs.readFileSync(guildPath + '/commands.json', 'utf8'));
  
    res.render('commands', { title: guildID, commands: commands });
  } catch (error) {
    const data = `Sorry, Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>`;
    res.status(404).render('error', { title: "Error", app: data });
  }
});

export default router;