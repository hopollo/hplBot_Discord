import { GuildMember, GuildChannel, DiscordAPIError, Collection } from "discord.js";
import { Log } from "../logs/logs";

export class PunishHandler {
  private _initiator: GuildMember;
  private _target: GuildMember;
  private _time: number | undefined;
  private _reason: string | undefined;
  private _channel: GuildChannel | undefined;

  // TODO : HoPollo, replace type with proper list
  constructor(initiator: GuildMember, target: GuildMember, type: string, time ?: number, reason ?: string, source ? : GuildChannel) {
    this._initiator = initiator;
    this._target = target;
    this._time = time;
    this._reason = reason;

    switch (type) {
      case 'mute': this.mute(); break;
      case 'unmute': this.unmute(); break;
      case 'ban': this.ban(); break;
      case 'kick': this.unban(); break;
      case 'unban': this.unban(); break;
      case 'eject': this.eject(); break;

      default:
        console.error(`Error : Unkown Pusnish type (${type})`);
        break;
    }
  }

  private mute() {}
  private unmute() {}
  private ban() {
    if (!this._initiator.hasPermission('BAN_MEMBERS') && 
        !this._target.bannable) return undefined;
    
    this._target.ban({ days: this._time, reason:  this._reason })
      .then(() => {
        const msgContent = 'Banned';
        // TODO (hopollo) : purge all his past msg option
        new Log(this._initiator.user, msgContent);
      })
      .catch((err: DiscordAPIError) => {
        this._initiator.send(`Error while trying to ban **${this._target}**: *${err.message}*, Maybe try it from Discord.`);
      });
  }
  private async unban() {
    if (this._initiator.hasPermission('BAN_MEMBERS')) return undefined;
    /*
    this._initiator.guild.fetchBans()
      .then(res=> res.toJSON())
      .then(data => console.log(data))
      .catch(console.error);
    */
  }

  private eject() {}
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