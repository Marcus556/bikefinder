const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const adSchema = require('./models/AdSchema')
const redCmdColor = '\x1b[31m'
const greenCmdColor = '\x1b[32m'
const DB_URI = require('./config/keys').mongoURI;
const CollectionUrl = 'https://www.blocket.se/annonser/blekinge/fordon/motorcyklar?cg=1140&r=19';

mongoose.connect(DB_URI, (err) => {
  if (err) console.log(redCmdColor, 'Connection to db failed ' + err);
  console.log(greenCmdColor, 'connected to db!')
});
scrape();
setInterval(() => { scrape() }, 60000);

function scrape() {
  console.log('kör scrape()');
  request(CollectionUrl, (err, res, html) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(html);

      for (let i = 0; i < 3; i++) {
        const article = $('article').get(i);

        const title = $(article).find('h2').text();
        let url = $(article).find('h2').find('a').attr('href');
        url = `http://blocket.se${url}`
        const thumbnail = $(article).find('img').attr('src');

        if (!title == '') {
          checkAndAdd(title, url, thumbnail, sliceUrl(thumbnail));
        } else {
          return
        }

      }

    }
  })

}

function checkAndAdd(title, url, thumbnail, img, price) {
  Ad.findOne({ 'title': title }, function (err, ad) {
    if (ad === null) {
      const adToAdd = new Ad({
        title,
        url,
        thumbnail,
        img,
        price,
      })
      adToAdd.save();
      console.log(greenCmdColor, `Added '${title}' to the database`)
    } else {
      return;
    }
  });

}

function sliceUrl(url) {
  const slicedUrl = url.slice(0, url.length - 17) + '?type=original';
  return slicedUrl;
}



function checkClass(element, stringToFind) {
  if (element === undefined) return
  return element.includes(stringToFind)
}


function scrapeInfo(infoUrl) {
  request(infoUrl, (err, res, html) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(html);

      const article = $('article').first();
      const divs = $(article).find('div');
      const info = {
        price: findContainer(divs, 'Price__StyledPrice'),
        desc: findContainer(divs, 'BodyCard__DescriptionPart'),
      }
      console.log(info.price)


      function findContainer(arrayOfelements, stringToFind) {
        let returnedValue = '';
        $(arrayOfelements).each(function (i, elem) {
          const className = $(elem).attr('class');
          if (checkClass(className, stringToFind)) {
            const desc = $(elem).text();
            returnedValue = desc;
          }

        });
        return returnedValue
      }

      function checkClass(element, stringToFind) {
        if (element === undefined) return
        return element.includes(stringToFind)
      }
      return info;

    }

  })
}




// request('https://www.blocket.se/annonser/kronoberg/fordon/bilar?cb=30&cbl1=16&cg=1020&r=21', (err, res, html) => {
//   if (!err && res.statusCode == 200) {

//   console.log(arrayWithAds)
