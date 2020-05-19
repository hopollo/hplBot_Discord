import { Router } from 'express';
import url, { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import {writeFile, existsSync, readFileSync, readFile} from 'fs';
import path from 'path';
import { Guild } from 'discord.js';
import { Bot_Config } from '../../../config.json';
import mdLog from '../middlewares/authMiddelware';

const commandsPath = Bot_Config.Servers_Config.templates.commandsFile;
const configPath = Bot_Config.Servers_Config.templates.configFile;

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

  const exists = existsSync(oathPath);
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

    writeFile(oathPath, JSON.stringify(request), (err) => {
      if (err) console.error;
    });

    oauth = request;
  } else {
    oauth = JSON.parse(readFileSync(oathPath).toString());
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
    //let guildsResults: object[] = [];
    
    return Object.values(guilds).filter((g: any) => g.owner === true && 
            existsSync(path.join(__dirname, '../../..', 'lib', 'servers', g.id)) === true);
    
   /*
    await guilds.forEach(async (g: Guild) => {
      const guildPath = path.join(__dirname, '../../..', 'lib', 'servers', g.id);
      
      if (!g.owner || !existsSync(guildPath)) return undefined;
      
      const guildName = g.name;
      const guildID = g.id;
      const commands = await JSON.parse(readFileSync(path.join(guildPath, commandsPath)).toString());
      const config = await JSON.parse(readFileSync(path.join(guildPath, configPath)).toString());
      const obj = {
        guildID,
        guildName,
        commands,
        config
      }

      guildsResults.push(obj);
    })

    return guildsResults;
    */
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

router.get('/:guildID/:type', mdLog, async (req, res) => {
  const guildID = req.params.guildID;
  const type = req.params.type;
  const typeFile = `${type}.json`; 
  const filePath = path.join(__dirname, '../../..', 'lib', 'servers', guildID, typeFile);
  const result = await JSON.parse(readFileSync(filePath).toString());
  
  res.status(200).json(result);
});

router.get('/:guildID(\\d+)', (req, res) => {
  console.log('not auth case');
  try {
    const guildID = req.params.guildID;
    const guildPath = path.join(__dirname, '../../..', 'lib', 'servers', guildID);
    const commands = JSON.parse(readFileSync(guildPath + '/commands.json', 'utf8'));
  
    res.render('commands', { title: guildID, commands: commands });
  } catch (error) {
    const data = `Sorry, Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>`;
    res.status(404).render('error', { title: "Error", app: data });
  }
});

export default router;