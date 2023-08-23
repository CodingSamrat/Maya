const { Schema, model } = require("mongoose");

const schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lastDaily: {
    type: Date,
  },
});

module.exports = model("Economy", schema);
