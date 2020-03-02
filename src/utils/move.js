"use_strict";

exports.moveTo = async (target, destination) => {
  await target.setVoiceChannel(destination).catch(console.error);
}