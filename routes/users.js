require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//model
const User = require('../models/UserSchema');

router.post('/messages', authenticateJwtToken, (req, res) => {
  User.findOne({
    username: req.body.recipient
  }, async function (err, user) {
    if (user === null) {
      console.log('no such user')
      res.send('no such user')
      return
    }
    if (user) {
      console.log('user exist!')
      const message = {
        id: Math.random().toString(36).substring(7),
        recipient: req.body.recipient,
        from: req.user.name,
        title: req.body.title,
        message: req.body.message,
      }
      user.messages.push(message)
      user.save()
      res.json({
        message
      })
    } else {
      console.log('error')
      res.send('error')
    }
  })
})

router.get('/messages', authenticateJwtToken, (req, res) => {
  let query;
  query = User.find();
  query.exec()
    .then(users => users.filter(user => user.username === req.user.name)[0])
    .then(user => res.json(user.messages))
    .catch(err => console.log(err))
});


router.post('/', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    newUser.save()
      .then(user => res.json(user));
  } catch {
    res.status(500).send()
  }
});

router.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username
  }, async function (err, user) {

    if (user === null) {
      console.log('no such user')
      res.send('no such user')
      return
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      console.log('password match!')

      const username = req.body.username
      const user = { name: username }

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      res.json({ accessToken: accessToken })
    } else {
      console.log('Wrong password')
      res.send('Wrong password')
    }
  })
})
function authenticateJwtToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}



module.exports = router;