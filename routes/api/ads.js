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

router.get('/owned', (req, res) => {
  let query;
  query = Ad.find();
  query.exec()
    .then(ads => res.send(ads.filter(ad => ad.owner === req.user.name)))
    .catch(err => console.log(err))
});

router.get('/:id', function (req, res, next) {
  var id = req.params.id
  Ad.findById(id)
    .lean().exec(function (err, results) {
      if (err) return console.error(err)
      try {
        res.send(results)
      } catch (error) {
        console.log("errror getting results")
        console.log(error)
      }
    })
})


router.post('/', async (req, res) => {
  try {
    const newAd = new Ad({
      owner: req.user.name,
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