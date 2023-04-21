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

require('./index');
require('./config');

const { Collection, Function, color } = require("./modules");
const { isUrl } = Function;
const axios = require("axios");
const chalk = require("chalk");

const cool = new Collection();
const { RLUsers } = require("./database/RLDataSchema.js");
const prefix = $.prefix;

module.exports = async (RLink, m, commands, chatUpdate, store) => {
  try {
    let { type, isGroup, sender, from } = m;
    let body =
      type == "buttonsResponseMessage"
        ? m.message[type].selectedButtonId
        : type == "listResponseMessage"
        ? m.message[type].singleSelectReply.selectedRowId
        : type == "templateButtonReplyMessage"
        ? m.message[type].selectedId
        : m.text;
    let prat =
      type === "conversation" && body?.startsWith(prefix)
        ? body
        : (type === "imageMessage" || type === "videoMessage") &&
          body &&
          body?.startsWith(prefix)
        ? body
        : type === "extendedTextMessage" && body?.startsWith(prefix)
        ? body
        : type === "buttonsResponseMessage" && body?.startsWith(prefix)
        ? body
        : type === "listResponseMessage" && body?.startsWith(prefix)
        ? body
        : type === "templateButtonReplyMessage" && body?.startsWith(prefix)
        ? body
        : "";

    const metadata = isGroup ? await RLink.groupMetadata(from) : {};
    const pushname = m.pushName; //|| 'NO name'
    const participants = isGroup ? metadata.participants : [sender];
    const groupAdmin = isGroup
      ? participants.filter((v) => v.admin !== null).map((v) => v.id)
      : [];
    const botNumber = await RLink.decodeJid(RLink.user.id);
    const isBotAdmin = isGroup ? groupAdmin.includes(botNumber) : false;
    const isAdmin = isGroup ? groupAdmin.includes(sender) : false;
    const isCreator = [botNumber, ...$.owner]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    const isOwner = $.owner.includes(m.sender);

    const isCmd = body.startsWith(prefix);
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || m.msg).mimetype || " ";
    const isMedia = /image|video|sticker|audio/.test(mime);
    const budy = typeof m.text == "string" ? m.text : "";
    const args = body.trim().split(/ +/).slice(1);
    const ar = args.map((v) => v.toLowerCase());
    let text = (q = args.join(" "));
    const groupName = m.isGroup ? metadata.subject : "";
    const cmdName = prat
      .slice(prefix.length)
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();

    const cmd = commands.get(cmdName) || commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName)) || "";
    const icmd = commands.get(cmdName) || commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
    const mentionByTag =
      type == "extendedTextMessage" &&
      m.message.extendedTextMessage.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.mentionedJid
        : [];

    if (!isCreator) {
      let checkban =
        (await RLUsers.findOne({
          id: m.sender,
        })) ||
        (await new RLUsers({
          id: m.sender,
          name: m.pushName,
        }).save());

    }

    //----------------------------------------------------------------------------------------------------------------//

    

    const flags = args.filter((arg) => arg.startsWith("--"));
    if (body.startsWith(prefix) && !icmd) {
      let mikutext = `No such command programmed *${pushname}* senpai! Type *${prefix}help* to get my full command list!\n`;
      const reactmxv = {
        react: {
          text: '❌',
          key: m.key,
        },
      };
      await RLink.sendMessage(m.from, reactmxv);

      RLink.sendMessage(m.from, { caption: mikutext }, {
        quoted: m,
      });
    }

    if (m.message) {
      console.log(
        chalk.black(chalk.bgWhite("[ MESSAGE ]")),
        chalk.black(chalk.bgGreen(new Date())),
        chalk.black(chalk.bgBlue(budy || m.mtype)) +
          "\n" +
          chalk.magenta("=> From"),
        chalk.green(pushname),
        chalk.yellow(m.sender) + "\n" + chalk.blueBright("=> In"),
        chalk.green(m.isGroup ? m.from : "Private Chat", m.chat)
      );
    }

    if (
      text.endsWith("--info") ||
      text.endsWith("--i") ||
      text.endsWith("--?")
    ) {
      let data = [];
      if (cmd.alias) data.push(`*Alias :* ${cmd.alias.join(", ")}`);

      if (cmd.desc) data.push(`*Description :* ${cmd.desc}\n`);
      if (cmd.usage)
        data.push(
          `*Example :* ${cmd.usage
            .replace(/%prefix/gi, prefix)
            .replace(/%command/gi, cmd.name)
            .replace(/%text/gi, text)}`
        );

      let buttonmess = {
        text: `*Command Info*\n\n${data.join("\n")}`,
      };
      let reactionMess = {
        react: {
          text: "💬",
          key: m.key,
        },
      };
      await RLink.sendMessage(m.from, reactionMess).then(() => {
        return RLink.sendMessage(m.from, buttonmess, {
          quoted: m,
        });
      });
    }
    
    if (!cool.has(m.sender)) {
      cool.set(m.sender, new Collection());
    }
    const now = Date.now();
    const timestamps = cool.get(m.sender);
    const cdAmount = (cmd.cool || 0) * 1000;

    if (timestamps.has(m.sender)) {
      const expiration = timestamps.get(m.sender) + cdAmount;

      if (now < expiration) {
        let timeLeft = (expiration - now) / 1000;
        return await RLink.sendMessage(
          m.from,
          {
            text: `Command Rejected ! Don't Spam ! You can use command after _${timeLeft.toFixed(
              1
            )} second(s)_`,
          },
          {
            quoted: m,
          }
        );
      }
    }

    timestamps.set(m.sender, now);
    setTimeout(() => timestamps.delete(m.sender), cdAmount);

    try {
      cmd.exec(RLink, m, {
        name: "RLINK",
        metadata,
        pushName: pushname,
        participants,
        body,
        args,
        ar,
        groupName,
        botNumber,
        flags,
        isAdmin,
        groupAdmin,
        text,
        quoted,
        mentionByTag,
        mime,
        isBotAdmin,
        prefix,
        isCreator,
        store,
        command: cmd.name
      });
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    e = String(e);
    if (!e.includes("cmd.exec")) console.error(e);
  }
};
