var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var module = require('module');
var User = new Schema({
    email : String,
    name : String,
    avatarUrl : String
});

module.exports = User;