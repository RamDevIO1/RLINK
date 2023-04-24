module.exports = {
  name: "test",
  alias: ["tes", "tst"],
  desc: ".",
  category: "general",
  async exec(RLink, m, { args, pushName, prefix, name }) {
    
    const input = args[0].split("|");
    let input1 = input[0] // Nama pengirim 
    let input2 = input[1] // Nomer penerima 
    let input3 = input[2] // Pesan
    
    
    RLink.sendMessage(`${input2}@s.whatsapp.net`, { text: `Kamu dapat pesan dari: ${input1}` })
    RLink.sendMessage(`${input2}@s.whatsapp.net`, { text: `Pesan:\n${input3}` })
  }
}

