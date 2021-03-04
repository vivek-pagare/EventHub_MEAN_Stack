var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var userSchema = new mongoose.Schema({
    email: String,
    password: String
});


module.exports=mongoose.model("user",userSchema,'users');
//var User= mongoose.model('User','userSchema')

//module.exports=User;