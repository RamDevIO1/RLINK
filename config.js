/* –––––––––––––––––––––––––––––––––––––––––––– /
/     ██████╗ ██╗     ██╗███╗   ██╗██╗  ██╗     /
/     ██╔══██╗██║     ██║████╗  ██║██║ ██╔╝     /
/     ██████╔╝██║     ██║██╔██╗ ██║█████╔╝      /
/     ██╔══██╗██║     ██║██║╚██╗██║██╔═██╗      /
/     ██║  ██║███████╗██║██║ ╚████║██║  ██╗     /
/     ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝     /
/********************************************** /
/ – [Created By R.Dev] – [RLINK BOT WhatsApp] – /
/ –––––––––––––––––––––––––––––––––––––––––––– */

require("dotenv").config();
let owners = process.env.OWNERS;

// -------------------------------------------------------------- //

global.owner     = process.env.OWNERS.split(",");
global.mongodb   = process.env.MONGODB || "";
global.sessionId = process.env.SESSION_ID || "rlink";
global.prefix    = process.env.PREFIX || "!";
global.packname  = process.env.PACKNAME || `RLINK`;
global.author    = process.env.AUTHOR || "R.DEV";
global.port      = process.env.PORT || "8000";

module.exports = { mongodb: global.mongodb };
