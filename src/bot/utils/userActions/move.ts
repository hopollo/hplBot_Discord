import { GuildMember, VoiceChannel } from "discord.js";

export class Mover {
  private _user: GuildMember;
  private _destination: VoiceChannel;

  constructor(target: GuildMember, destination: VoiceChannel) {
    this._user = target;
    this._destination = destination;
    this.moveTo(this._user, this._destination);
  }

  private moveTo(target: GuildMember, destination: VoiceChannel) {
    /* Status:
    CONNECTED: 0
    CONNECTING: 1
    AUTHENTICATING: 2
    RECONNECTING: 3
    DISCONNECTED: 4
    */
    if (target.voice !== undefined) {
      target.voice.setChannel(destination, "Moved to own temp channel")
        .catch((e) => console.error(e));
    }
  }
}
