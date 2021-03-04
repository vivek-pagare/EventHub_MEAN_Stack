var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var userSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Number
});


module.exports=mongoose.model("events1",userSchema,'events');


