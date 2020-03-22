import { VoiceChannel, GuildMember } from "discord.js";

export class Mover {
  private _user: GuildMember;
  private _destination: VoiceChannel;

  constructor(target: GuildMember, destination: VoiceChannel) {
    this._user = target;
    this._destination = destination;
    this.moveTo(this._user, this._destination);
  }

  private moveTo(target: GuildMember, destination: VoiceChannel) {
    // Status : DISCONNECTED: 4
    if (target.voice.connection?.status !== 4) return target.voice.setChannel(destination);
  }
}