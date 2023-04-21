const { model, Schema } = require("mongoose");

const schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },

  session: String,
});

const sessionSchema = model("sessions", schema);

module.exports = {
  sessionSchema
}