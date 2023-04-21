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
var $ = {};

// -------------------------------------------------------------- //

$.owner     = process.env.OWNERS.split(",");
$.mongodb   = process.env.MONGODB || "";
$.sessionId = process.env.SESSION_ID || "rlink";
$.prefix    = process.env.PREFIX || "!";
$.packname  = process.env.PACKNAME || `RLINK`;
$.author    = process.env.AUTHOR || "R.DEV";
$.port      = process.env.PORT || "8000";

module.exports = { mongodb: $.mongodb };
