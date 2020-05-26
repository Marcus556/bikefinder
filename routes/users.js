const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


//model
const User = require('../models/UserSchema');

router.get('/', (req, res) => {
  let query;
  if (req.query.name) {
    query = User.findOne({
      'username': req.query.name
    })
  } else {
    query = User.find();
  }
  query.exec()
    .then(users => res.send(users))
    .catch(err => console.log(err))
});

router.post('/', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      admin: req.body.admin
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
      res.send('You are logged in!')
    } else {
      console.log('Wrong password')
      res.send('Wrong password')
    }
  })
})


module.exports = router;