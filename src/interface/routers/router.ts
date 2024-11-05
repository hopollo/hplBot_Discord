import path from "node:path";
import { existsSync, readFileSync, writeFile } from "node:fs";
import url, { URLSearchParams } from "node:url";
import { Router } from "express";
import type { Guild } from "discord.js";
import mdLog from "../middlewares/authMiddelware.ts";

require("dotenv").config();

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.render("index", { title: "Welcome" });
});

router.get("/try", (_req: Request, res: Response) => {
  res.redirect(
    `https://discordapp.com/oauth2/authorize?client_id=${
      Deno.env.get("CLIENT_ID")
    }&scope=bot`,
  );
});

router.get("/login", (_req: Request, res: Response) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${
      Deno.env.get("CLIENT_ID")
    }&redirect_uri=${
      Deno.env.get("REDIRECT_URI")
    }&response_type=code&scope=guilds%20identify`,
  );
});

router.get("/template", (_req: Request, res: Response) => {
  res.redirect("https://discord.new/N3hmBUB5vqd7");
});

router.get("/callback", async (req: Request, res: Response) => {
  const obj = url.parse(req.url, true);

  if (!obj.query.code) {
    return res.send("Error while authenticating with Discord");
  }
  const oathPath = path.join(
    __dirname,
    "../../..",
    "lib",
    "oauths",
    obj.query.code.toString(),
  );

  let oauth;

  const exists = existsSync(oathPath);
  if (!exists) {
    const data = {
      code: obj.query.code,
      redirect_uri: Deno.env.get("REDIRECT_URI"),
      grant_type: "authorization_code",
      client_id: Deno.env.get("CLIENT_ID"),
      client_secret: Deno.env.get("CLIENT_SECRET"),
      scope: "Identify guilds",
    };

    const request = await fetch("https://discordapp.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data as Record<string, string>),
      redirect: "follow",
    })
      .then((res) => res.json())
      .catch((err) => res.send(err));

    writeFile(oathPath, JSON.stringify(request), (err) => {
      if (err) console.error;
    });

    oauth = request;
  } else {
    oauth = JSON.parse(readFileSync(oathPath).toString());
  }

  const result = await fetch("https://discordapp.com/api/v6/users/@me", {
    headers: {
      authorization: `${oauth.token_type} ${oauth.access_token}`,
    },
  })
    .then((res) => res.json())
    .catch(console.error);

  const guilds = await fetch("https://discordapp.com/api/v6/users/@me/guilds", {
    headers: {
      authorization: `${oauth.token_type} ${oauth.access_token}`,
    },
  })
    .then((res) => res.json())
    .then((guilds: Guild[]) => {
      //let guildsResults: object[] = [];

      return Object.values(guilds).filter(
        (g: any) =>
          g.owner === true &&
          existsSync(
              path.join(__dirname, "../../..", "lib", "servers", g.id),
            ) === true,
      );

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
    .catch((e) => console.error(e));

  const userData = {
    title: result.username,
    userImage:
      `<img src="https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}.webp">`,
    servers: guilds,
    username: result.username,
    commands: null,
    config: null,
  };

  res.render("user", userData);

  // res.redirect(`/user/${result.username.toLowerCase()}`);
});

router.get("/:guildID/:type", mdLog, async (req, res) => {
  const guildID = req.params.guildID;
  const type = req.params.type;
  const typeFile = `${type}.json`;
  const filePath = path.join(
    __dirname,
    "../../..",
    "lib",
    "servers",
    guildID,
    typeFile,
  );
  const result = await JSON.parse(readFileSync(filePath).toString());

  res.status(200).json(result);
});

router.get("/:guildID(\\d+)", (req, res) => {
  console.log("not auth case");
  try {
    const guildID = req.params.guildID;
    const guildPath = path.join(
      __dirname,
      "../../..",
      "lib",
      "servers",
      guildID,
    );
    const commands = JSON.parse(
      readFileSync(guildPath + "/commands.json", "utf8"),
    );

    res.render("commands", { title: guildID, commands: commands });
  } catch (error) {
    const data =
      `Sorry, Page Not Found or Doesn't Exists Anymore ! <a href='/'><button>Exit</button></a>`;
    console.error(error);
    res.status(404).render("error", { title: "Error", app: data });
  }
});

export default router;
