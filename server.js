require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/keys').mongoURI;
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

const ads = require('./routes/api/ads')
const users = require('./routes/users')

const app = express();
app.use(cors());

//body-parsers middleware
app.use(bodyParser.json());

mongoose
  .connect(db)
  .then(() => console.log('Connected to the DB..'))
  .catch(err => console.log(err));

// routes 
app.use('/users', users)
app.use('/api/ads', authenticateJwtToken, ads);

// Temp practise jwt route

const posts = [
  {
    username: 'nisse',
    title: 'title 1'
  },
  {
    username: 'nisse',
    title: 'title 1'
  }
]
app.get('/posts', authenticateJwtToken, (req, res) => {
  res.json(posts)
})

//create a jwt-token and send back to the client
app.post('/postlogin', (req, res) => {
  const username = req.body.username
  const user = { name: username }

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json({ accessToken: accessToken })
})
// auth the users jwt token. If the req-headers auth baerer token = null, return 401, else next(continue from middleware)
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



app.listen(port, () => {
  console.log(`Server started on ${port}`)
})