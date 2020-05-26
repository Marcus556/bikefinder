const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/keys').mongoURI;
const port = process.env.PORT || 5000;

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
app.use('/api/ads', ads);



app.listen(port, () => {
  console.log(`Server started on ${port}`)
})