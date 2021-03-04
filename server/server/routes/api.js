const express = require('express')
const jwt = require('jsonwebtoken')


const User = require('../modules/user')
const Events = require('../modules/events1')
const Special = require('../modules/specialEvents')

const router = express.Router()

const mongoose = require('mongoose')
const db = "mongodb://atul:atul@eventsdb-shard-00-00-3cxed.mongodb.net:27017,eventsdb-shard-00-01-3cxed.mongodb.net:27017,eventsdb-shard-00-02-3cxed.mongodb.net:27017/test1?ssl=true&replicaSet=Eventsdb-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(db, err => {
    if(err){
        console.error('Error!'+ err)
    } else{
        console.log('connection to mongodb')
    }
    
})

function verifyToken(req, res, next){
  if(!req.headers.authorization){
    return res.status(401).send('unauthorization request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null'){
    return res.status(401).send('unauthorization request')
  }
  let payload = jwt.verify(token, 'secretkey')
  if(!payload) {
    return res.status(401).send('unauthorization request')

  }
  req.userId = payload.subject
  next()
}


router.get('/',(req, res) => {
    res.send('From API route')
})

router.post('/register',(req, res) => {
    let userData = req.body
    let user = new  User(userData)
    user.save((error, registeredUser) =>{
        if(error){
            console.log(error)
        } else{
          let payload =  { subject: registeredUser._id}
          let token = jwt.sign(payload,'secretkey')
            res.status(200).send({token})
        }
    })
})

router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({email: userData.email}, (error, user) => {
      if (error) {
        console.log(error)    
      } else {
        if (!user) {
          res.status(401).send('Invalid Email')
        } else 
        if ( user.password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
          let payload =  { subject: user._id}
          let token = jwt.sign(payload,'secretkey') 
          
          res.status(200).send({token})
        }
      }
    })
  })
  

  router.get('/events', (req,res) => {
    console.log('Get request for all events');
    Events.find({})
    .exec(function(err, events){
      if(err){
        console.log("Error retrieving Events");
      }else{
        res.json(events)

      }
    });

   
  });
  
  router.get('/special',verifyToken, (req, res) => {
    console.log('Get request for all Special Events');
    Special.find({})
    .exec(function(err, special){
      if(err){
        console.log("Error retrieving Events");
      }else{
        res.json(special)

      }
    });

     
  })
 





module.exports = router