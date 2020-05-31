const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const adSchema = require('./models/AdSchema')
const redCmdColor = '\x1b[31m'
const greenCmdColor = '\x1b[32m'
const DB_URI = require('./config/keys').mongoURI;
//url to collect ads from.
const CollectionUrl = 'https://www.blocket.se/annonser/hela_sverige/fordon/motorcyklar/touring?cg=1146&page=6';

//connect to database
mongoose.connect(DB_URI, (err) => {
  if (err) console.log(redCmdColor, 'Connection to db failed ' + err);
  console.log(greenCmdColor, 'connected to db!')
});

//run the scraper, and again every ... ms.
scrape();
setInterval(() => { scrape() }, 60000);

function scrape() {
  console.log('Scraping url for new motorcycles...');
  request(CollectionUrl, (err, res, html) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(html);

      // Scrapes the first 10 new ads, to not overpopulate the db..
      for (let i = 0; i < 10; i++) {
        const article = $('article').get(i);
        const title = $(article).find('h2').text();
        let url = $(article).find('h2').find('a').attr('href');
        url = `http://blocket.se${url}`
        const thumbnail = $(article).find('img').attr('src');

        //runs scrapeInfo() and its callback to go one layer deeper to scrape the ad-description and the price.
        scrapeInfo(url, (info) => {
          console.log(info.price)
          if (!title == '') {
            //slices the scraped price to get rid of the 'kr' ending.
            let slicedPrice = info.price.slice(0, info.price.length - 2);
            slicedPrice = slicedPrice.replace(/\s+/g, '');
            slicedPrice = Number(slicedPrice);
            checkAndAdd(slicedPrice, info.desc, title, url, thumbnail, sliceUrl(thumbnail))
          } else {
            return
          }
        })
      }

    }
  })

}

function checkAndAdd(price, desc, title, url, thumbnail, img) {
  Ad.findOne({ 'title': title }, function (err, ad) {
    if (ad === null) {
      const adToAdd = new Ad({
        owner: 'admin',
        title,
        url,
        thumbnail,
        img,
        price,
        desc,
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


function scrapeInfo(infoUrl, callback) {
  request(infoUrl, (err, res, html) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(html);

      const article = $('article').first();
      const divs = $(article).find('div');
      const info = {
        price: findContainer(divs, 'Price__StyledPrice'),
        desc: findContainer(divs, 'BodyCard__DescriptionPart'),
      }
      callback(info);


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
