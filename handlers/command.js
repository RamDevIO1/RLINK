const fs = require("fs");
const path = require("path").join;
let load = 0;

module.exports = (RLink) => {
  let $rootDir = path(__dirname, "../commands");
	let dir = fs.readdirSync($rootDir);

	dir.forEach(($dir) => {
		const commandFiles = fs.readdirSync(path($rootDir, $dir)).filter((file) => file.endsWith(".js"));
		for (let file of commandFiles) {
			const command = require(path($rootDir, $dir, file));
			RLink.commands.set(command.name, command);
			load++;
		}
	});
	console.log(RLink.modules.color("[@RLINK]", "magenta"), `loaded [${load}] commands!`);
};
