const mongoose = require('mongoose');
const modules = require('../modules');

module.exports.connect = async (URL) => {
  await mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log(modules.color("[DB]", "yellow"), "Connected To RLINK Database")
  }).catch((err) => {
    console.log(modules.color("[ERR]", "red"), err)
  })
  return mongoose
}