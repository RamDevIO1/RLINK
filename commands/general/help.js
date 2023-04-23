module.exports = {
	name: "help",
	alias: ["h", "cmd", "menu"],
	desc: "List perintah.",
	category: "general",
	async exec(RLink, m, { name, isCreator, sender, args, prefix, pushName }) {
		if (args[0]) {
			const data = [];
			const name = args[0].toLowerCase();
			const cmd = RLink.commands.get(name) || RLink.commands.find((cmd) => cmd.alias && cmd.alias.includes(name));
			if (!cmd || (cmd.category === "private" && !isCreator)) return await m.reply("No command found");
			else data.push(`*Cmd:* ${cmd.name}`);
			if (cmd.alias) data.push(`*Alias:* ${cmd.alias.join(", ")}`);
			if (cmd.desc) data.push(`*Description:* ${cmd.desc}`);
			if (cmd.use)
				data.push(
					`*Usage:* \`\`\`${prefix}${cmd.name} ${cmd.use}\`\`\`\n\nNote: [] = optional, | = or, <> = must filled`
				);

			return await m.reply(data.join("\n"));
		} else {
			const cmds = RLink.commands.keys();
			let category = [];

			for (let cmd of cmds) {
				let info = RLink.commands.get(cmd);
				if (!cmd) continue;
				if (!info.category || info.category === "private" || info.owner) continue;
				if (Object.keys(category).includes(info.category)) category[info.category].push(info);
				else {
					category[info.category] = [];
					category[info.category].push(info);
				}
			}
			let str =
				`HI, *${pushName === undefined ? sender.split("@")[0] : pushName}*\nIni adalah list perintah saya\n_Awali dengan *${prefix}* untuk menjalankan perintah_\n\n` +
				`╭───『 \`\`\`RLINK Commands\`\`\` 』──⊷\n`;
			const keys = Object.keys(category);
			for (const key of keys) {
			  str += `┃  ╭───┉┈◈◉◈┈┉───⌯
┃  │ ⌗ *${key.toUpperCase()}*
┃  ╰┬──┉┈◈◉◈┈┉───⌯
┃  ┌┤
${category[key].map((cmd, idx) =>`┃  │ \`\`\`⿻ ${cmd.name}\`\`\``).join("\n")}
┃  ╰─────────────⌯`
			}
			str += `╰━━━━━━━━━━━━━━──⊷\n`
			str += `*${prefix}help* diikuti dengan nama perintah atau *${prefix}<perintah> -info* untuk mendapatkan rincian perintah, e.g. ${prefix}help hello, ${prefix}hello -info`;
			await RLink.sendMessage(m.from, { text: str });
		}
	},
};