const msParser = require('ms-parser');

module.exports = async(d) => {
  const inside = d.inside;
  const { decodeJid, sender } = require("../../models/functions");
  if(!inside) {
    d.isError = true;
    return d.error(`❌ WhatscodeError: Usage: $cooldown[milliseconds;error]!`);
  } else {
    var [n, i] = inside.split(";");

    if(!n || !i) {
      d.isError = true;
      return d.error(`❌ WhatscodeError: Usage: $cooldown[milliseconds;error]!`);
    }

    n = msParser(n.replace(/\s/g, '')).ms
    const cooldown = d.cldn.get(`cooldown_${d.command.name}_${decodeJid(d.msg.key.remoteJid)}_${decodeJid(sender(d))}`)

    if(cooldown) {
      const timeRemaining = cooldown - Date.now();
      const dhms = Math.floor(timeRemaining / 86400000) + "d " + Math.floor(timeRemaining / 3600000 % 24) + "h " + Math.floor(timeRemaining / 60000 % 60) + "m " + Math.floor(timeRemaining / 1000 % 60) + "s";
      var time = dhms.replace(/0(d|h|m)/g, "")
      d.isError = true;
      return d.error(i.split("%time%").join(time.replace(/\s\s+/g, '')))
    } else {
      d.cldn.set(`cooldown_${d.command.name}_${decodeJid(d.msg.key.remoteJid)}_${decodeJid(sender(d))}`, Date.now() + n);
      setTimeout(() => d.cldn.delete(`cooldown_${d.command.name}_${decodeJid(d.msg.key.remoteJid)}_${decodeJid(sender(d))}`), n);
      return "";
    }
  }
};
