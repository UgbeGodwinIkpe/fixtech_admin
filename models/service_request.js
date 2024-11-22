const mongoose = require("mongoose")

const msgSchema = new mongoose.Schema({

    refid: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    customer: {
        type: String,
        required: true,
        min: 3,
        max: 100,
    },
    requestid: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    service: {
        type: String,
        required: true,
        min: 3
    },
    serviceid: {
        type: String,
        required: true,
        min: 3
    },
    servicetype: {
        type: String,
        required: true,
        min: 3
    },
    problem: {
        type: String,
        default: ""
    },
    timeslot: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    serviceStatus: {
        type: String,
        default: "pending",
        min: 3,
        max: 20,
    },
    createdAt: {
        type: String,
        default: Date.now
    }
})


module.exports = mongoose.model("services_request", msgSchema)