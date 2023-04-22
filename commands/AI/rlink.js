require("../../config")
const { Configuration, OpenAIApi } = require("openai");

module.exports = {
  name: "rlink",
  alias: ["rl", "ai", "chat"],
  desc: "chat to RLINK",
  category: "AI",
  async exec(RLink, m, { args, pushName, prefix, name, text }) {
    try {
      if (!global.keyopenai) return m.reply("Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file config.js\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
      if (!text) return m.reply(`Chat dengan AI.\n\nContoh:\n${prefix}rlink Apa itu AI`);
      const configuration = new Configuration({
        apiKey: "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",
      });
      const openai = new OpenAIApi(configuration);
    
      /*const response = await openai.createCompletion({
                  model: "text-davinci-003",
                  prompt: text,
                  temperature: 0, // Higher values means the model will take more risks.
                  max_tokens: 2048, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
                  top_p: 1, // alternative to sampling with temperature, called nucleus sampling
                  frequency_penalty: 0.3, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
                  presence_penalty: 0 // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
              });
                m.reply(`${response.data.choices[0].text}`);*/
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      });
      m.reply(`${response.data.choices[0].message.content}`);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        console.log(`${error.response.status}\n\n${error.response.data}`);
      } else {
        console.log(error);
        m.reply("Maaf, sepertinya ada yang error :" + error.message);
      }
    }
  }
}

