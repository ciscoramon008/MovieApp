const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    dob: {type: Date, required: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String},
    watchList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
    }],
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);