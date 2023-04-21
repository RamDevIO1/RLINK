module.exports = {
  name: "hi",
  alias: ["hello", "alive"],
  desc: "Say hello to bot.",
  category: "general",
  async exec(RLink, m, { args, pushName, prefix }) {
    const pad = (s) => (s < 10 ? "0" : "") + s;
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const secs = Math.floor(seconds % 60);
      return time = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    };
    const uptime = () => formatTime(process.uptime());
    await RLink.sendMessage(m.from, { caption: `\nHello *${pushName}*, I am *${botName}* bot. type *${prefix}help* to get my full command list.\n\n_🧩 Server Uptime:_ *${uptime()}*\n_🎀 Status:_ *Development*\n` }, { quoted: m })
  }
}

