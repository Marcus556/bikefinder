const express = require('express');
const router = express.Router();

//model
const Ad = require('../../models/AdSchema');

router.get('/', (req, res) => {
  let query;
  if (req.query.title) {
    query = Ad.findOne({
      'title': req.query.title
    })
  } else {
    query = Ad.find();
  }
  query.exec()
    .then(ads => res.send(ads))
    .catch(err => console.log(err))
});

router.post('/', async (req, res) => {
  try {
    const newAd = new Ad({
      title: req.body.title,
      price: req.body.price,
      info: req.body.info
    });
    newAd.save()
      .then(ad => res.json(ad));
  } catch {
    res.status(500).send()
  }
});

module.exports = router;