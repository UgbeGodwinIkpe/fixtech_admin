const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    region: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    country: {
        type: String,
        required: true,
        min: 3,
        max: 50,
    },
    premisesType: {
        type: String,
        required: true,
        min: 3,
        max: 50,
    },
    emailAddress: {
        type: String,
        required: true,
        max: 50,
    },
    firstname: {
        type: String,
        required: true,
        max: 50,
    },
    middlename: {
        type: String,
        required: true,
        max: 50,
    },
    lastname: {
        type: String,
        required: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
    },
    distanceFromCenter: {
        type: String,
        required: true,
        max: 50,
    },
    contact: {
        type: String,
        required: true,
        min: 8,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    houseNumber: {
        type: String,
        required: true,
    },
    streetName: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: ""
    },
    zip: {
        type: String,
        min: 4,
        max: 10,
    },
    refcount: {
        type: Number,
        default: 0,
    },
    refid: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    yearlyFee: {
        type: String,
        required: true,
    },
    paymenttype: {
        type: String,
        default: ""
    },
    accountName: {
        type: String,
        default: ""
    },
    accountNum: {
        type: String,
        default: ""
    },
    bankName: {
        type: String,
        default: ""
    },
    bankAddress: {
        type: String,
        default: ""
    },
    swiftCode: {
        type: String,
        default: ""
    },
    ifsc: {
        type: String,
        default: ""
    },
    mobileNum: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    paypalDetail: {
        type: String,
        default: ""
    },
    paymentLink: {
        type: String,
        default: ""
    }
})


module.exports = mongoose.model("fixtectcare_users", userSchema)