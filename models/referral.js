const mongoose = require("mongoose")

const referralSchema = new mongoose.Schema({

  type: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  category: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  name: {
    type: String,
    required: true,
    max: 50,
  },
  refid: {
    type: String,
  },
  amount: {
    type: String,
    default:""
  },
  mode: {
    type: String,
    default:""
  },
  createdAt: {
    type: String,
    default: Date.now
  }
})


module.exports = mongoose.model("Referral record", referralSchema)