import { GuildMember, GuildChannel, DiscordAPIError, Collection } from "discord.js";
import { Log } from "../logs/logs";

declare enum PunishTypes {
  ban = 0,
  eject = 1,
  kick = 2,
  mute = 3,
  unmute = 4,
  unban = 5,
}

export class PunishHandler {
  private _initiator: GuildMember;
  private _target: GuildMember;
  private _time: number | undefined;
  private _type: PunishTypes | string;
  private _reason: string | undefined;
  private _channel: GuildChannel | undefined;

  // TODO : HoPollo, replace type with proper list
  constructor(initiator: GuildMember, target: GuildMember, type: string, time?: number, reason?: string, source? : GuildChannel) {
    this._initiator = initiator;
    this._target = target;
    this._time = time;
    this._type = type;
    this._reason = reason;
    this._channel = source;

    switch (this._type) {
      case "ban"  : this.mute(); break;
      case "unmute" : this.unmute(); break;
      case "ban" : this.ban(); break;
      case "kick" : this.kick(); break;
      case "unban" : this.unban(); break;
      case "eject" : this.eject(); break;

      default:
        console.error(`Error : Unkown Pusnish type (${type})`);
        break;
    }
  }

  /**
   * Mute an User
   */
  private mute() {
    if (!this._initiator.hasPermission('MUTE_MEMBERS')) return undefined;

    this._target.voice.setMute(true, this._reason)
      .then(() => {
        const msgContent = `${this._initiator.displayName} Muted : **${this._target.displayName}** (Reason : ${this._reason})`;
        new Log(this._initiator.user, msgContent);
      })
      .catch((err: DiscordAPIError) => {
        this._initiator.send(`Error while trying to mute **${this._target.displayName}**: *${err.message}*, Maybe try it from Discord.`);
      });
  }
  
  /**
   * Unmute an User
   */
  private unmute() {
    if (!this._initiator.hasPermission('MUTE_MEMBERS')) return undefined;

    this._target.voice.setMute(false, this._reason).then(() => {
      const msgContent = `${this._initiator.displayName} Unmuted : **${this._target.displayName}** (Reason : ${this._reason})`;
      new Log(this._initiator.user, msgContent);
    })
    .catch((err: DiscordAPIError) => {
      this._initiator.send(`Error while trying to unmute **${this._target.displayName}**: *${err.message}*, Maybe try it from Discord.`);
    });
  }
  
  /**
   * Ban an User (in days)
   */
  private ban() {
    if (!this._initiator.hasPermission('BAN_MEMBERS') && 
        !this._target.bannable) return undefined;
    
    this._target.ban({ days: this._time, reason:  this._reason })
      .then(() => {
        const msgContent = `${this._initiator.displayName} Banned : **${this._target.displayName}**, ${this._time}d (Reason : ${this._reason})`;
        // TODO (hopollo) : purge all his past msg option
        new Log(this._initiator.user, msgContent);
      })
      .catch((err: DiscordAPIError) => {
        this._initiator.send(`Error while trying to ban **${this._target.displayName}**: *${err.message}*, Maybe try it from Discord.`);
      });
  }

  /**
   * Unban an User
   */
  private async unban() {
    if (this._initiator.hasPermission('BAN_MEMBERS')) return undefined;
    //TODO: (hopollo) : Finish unban feature
    //this._initiator.send('Feature not available yet');

    this._initiator.guild.fetchBans()
      .then(res=> res.toJSON())
      .then(console.log)
      .catch((err: DiscordAPIError) => {
        this._initiator.send(`Error while trying to unban **${this._target.displayName}**: *${err.message}*, Maybe try it from Discord.`);
      });
  }

  /**
   * Ejects an User from his current VoiceChannel
   */
  private eject() {
    if (!this._initiator.hasPermission('MANAGE_CHANNELS') ||
        !this._initiator.hasPermission('KICK_MEMBERS') &&    
        !this._target.kickable) return undefined;

    this._target.voice.kick(this._reason)
      .then(() => {
        const msgContent = `${this._initiator.displayName} Ejected : **${this._target.displayName}** (Reason : ${this._reason})`;
        new Log(this._initiator.user, msgContent);
      })
      .catch((err: DiscordAPIError) => {
        this._initiator.send(`Error while trying to eject **${this._target.displayName}**: *${err.message}*, Maybe try it from Discord.`);
      });
  }

  /**
   * Kick an User from the Guild
   */
  private kick() {
    if (!this._initiator.hasPermission('KICK_MEMBERS') || 
        !this._initiator.hasPermission('BAN_MEMBERS') && 
        !this._target.kickable) return undefined;

    this._target.kick(this._reason)
      .then(() => {
        const msgContent = 'Kicked';
        new Log(this._initiator.user, msgContent);
      })
      .catch((err: DiscordAPIError) => {
        this._initiator.send(`Error while trying to kick **${this._target}**: *${err.message}*, Maybe try it from Discord.`);
      });
  }
}