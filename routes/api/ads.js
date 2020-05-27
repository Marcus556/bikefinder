const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const randomStr = Math.random().toString(36).substring(7);
    cb(null, `${randomStr}-${file.originalname}`);
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 4
  },
  fileFilter: fileFilter
});

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


router.post('/', upload.single('adImage'), async (req, res, next) => {
  try {
    console.log(req.file)
    const newAd = new Ad({
      owner: req.user.name,
      title: req.body.title,
      price: req.body.price,
      desc: req.body.desc,
      thumbnail: `http://localhost:5000/uploads/${req.file.filename}`,
      img: `http://localhost:5000/uploads/${req.file.filename}`
    });
    newAd.save()
      .then(ad => res.json(ad));
  } catch {
    res.status(500).send()
  }
});

module.exports = router;