const mongoose = require('mongoose');
const modules = require('../modules');

module.exports.connect = async (dataurl) => {
  await mongoose.connect(dataurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log(modules.color("[DB]", "yellow"), "Connected To RLINK Database")
  }).catch((err) => {
    console.log(modules.color("[ERR]", "red"), err)
  })
  return mongoose
}