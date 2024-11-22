const mongoose = require("mongoose")

const msgSchema = new mongoose.Schema({

  refid: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  msg: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  createdAt: {
    type: String,
    default: Date.now
  }
})


module.exports = mongoose.model("Message record", msgSchema)