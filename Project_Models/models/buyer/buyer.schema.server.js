/**
 * Created by Soumya on 11/22/16.
 */

var mongoose = require("mongoose");

var BuyerSchema = {

    username: {type: String, required: true},
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateCreated: {type: Date, default: Date.now()},
    role: {type: String},
    quantity:{type: Number},
    varietyname:String,
    cart: [{
        varietyname: String,
        quantity: {type: Number, min: 1},
        sellername:String
    }]
};

module.exports = new mongoose.Schema(BuyerSchema, { collection : 'user' });
module.exports.BuyerSchema = BuyerSchema;
