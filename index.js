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

require('./RLINK');
require('./config');

const {
  default: RLSocket,
  DisconnectReason,
  delay,
  fetchLatestBaileysVersion,
  useSingleFileAuthState,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  proto
} = require("@adiwajshing/baileys");

const express     = require("express");
const qrcode      = require('qrcode');
const pino        = require('pino');
const fs          = require("fs");
const path        = require("path");
const FileType    = require('file-type');
const { join }    = require("path");
const { Boom }    = require("@hapi/boom");
const chalk       = require("chalk");
const figlet      = require('figlet');
const PhoneNumber = require('awesome-phonenumber');

const { Function, Collection, Simple, color } = require("./modules");
const { serialize, WAConnection } = Simple;
const { smsg } = Function;
const modules = require('./modules')

const database = require('./database');
const Auth     = require('./Auth');

const store = makeInMemoryStore({
  logger: pino().child({
    level: 'silent',
    stream: 'store'
  })
});

const PORT = global.port;
const app = express();
let QR_GENERATE = "invalid";

let status;

// %%%%%%%%%%% - [ INIT ] - %%%%%%%%%%% //
const RLINK = async () => {
  database.connect(global.mongodb);
  
  const { getAuthFromDatabase } = new Auth(global.sessionId)
  const { saveState, state, clearState } = await getAuthFromDatabase()
  let { version, isLatest } = await fetchLatestBaileysVersion()
  
  console.log(modules.color(figlet.textSync("RLINK", {
    font: "Standard",
    horizontalLayout: "default",
    vertivalLayout: "default",
    whitespaceBreak: false
  }), "magenta"));
  
  const RLink = RLSocket({
    logger: pino({
      level: 'silent'
    }),
    printQRInTerminal: true,
    browser: ['RLINK', 'Safari', '1.0.0'],
    auth: state,
    version
  })
  
  RLink.modules = modules
  RLink.commands = new Collection()
  
  require(`./handlers/command`)(RLink);
  
  store.bind(RLink.ev);
  
  RLink.ev.on('creds.update', saveState)
  RLink.serializeM = (m) => smsg(RLink, m, store)
  
  RLink.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    status = connection;
    if (connection) {
      await console.info(`[RLINK] Server Status => ${connection}`);
    }
  
    if (connection === 'close') {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        RLINK();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        RLINK();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        clearState()
        console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        RLINK();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        RLINK();
      } else {
        console.log(`Disconnected: Reason "Probably your WhatsApp account Banned for Spamming !\n\nCheck your WhatsApp !"`)
      }
    }
    if (qr) { QR_GENERATE = qr; }
  })
  
  RLink.ev.on("messages.upsert", async (chatUpdate) => {
    m = serialize(RLink, chatUpdate.messages[0])
  
    if (!m.message) return
    if (m.key && m.key.remoteJid == "status@broadcast") return
    if (m.key.id.startsWith("BAE5") && m.key.id.length == 16) return
    require("./RLINK.js")(RLink, m, RLink.commands, chatUpdate)
  })
  
  RLink.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
  }
  
  RLink.ev.on('contacts.update', update => {
    for (let contact of update) {
      let id = RLink.decodeJid(contact.id)
      if (store && store.contacts) store.contacts[id] = {
        id,
        name: contact.notify
      }
    }
  })
  
  RLink.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
  }
  
  return RLink
}

RLINK();

app.use("/", express.static(join(__dirname, "Page")));
app.get("/qr", async (req, res) => {
    const { session } = req.query;
    if (!session)
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Provide the session id for authentication")
      .end();
    if (global.sessionId !== session)
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Invalid session")
      .end();
    if (status == "open")
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Session already exist")
      .end();
    res.setHeader("content-type", "image/png");
    res.send(await qrcode.toBuffer(QR_GENERATE));
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});


let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`${__filename} Updated`))
    delete require.cache[file]
    require(file)
})
