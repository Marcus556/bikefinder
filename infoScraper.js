const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const adSchema = require('./models/AdSchema')
const redCmdColor = '\x1b[31m'
const greenCmdColor = '\x1b[32m'
const DB_URI = 'mongodb+srv://scraper:mosnicemos@cluster0-nex6x.mongodb.net/scraper?retryWrites=true&w=majority'
const url = 'https://www.blocket.se/annons/skane/aprilia_rs4_125/89789682';



scrape();

function scrape() {
  console.log('kör scrape()');

  request(url, (err, res, html) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(html);


      const article = $('article').first();

      const title = $(article).find('h1').text();
      const info = $(article).find('div');
      const output = $(info).text();


      findContainer(info, 'Price__StyledPrice')
      findContainer(info, 'BodyCard__DescriptionPart');


      function findContainer(arrayOfelements, stringToFind) {
        $(arrayOfelements).each(function (i, elem) {
          const className = $(elem).attr('class');
          if (checkClass(className, stringToFind)) {
            const desc = $(elem).text();
            console.log(desc)
          }
        });
      }

      function checkClass(element, stringToFind) {
        if (element === undefined) return
        return element.includes(stringToFind)
      }


      // const url = $(article).find('h2').find('a').attr('href');
      // const img = $(article).find('img').attr('src');
    }
  })
}





