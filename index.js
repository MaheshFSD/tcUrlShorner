require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const URL = require('url').URL
const dns = require('dns');
const urlparser = require('url');
const {MongoClient} = require('mongodb');
// Basic Configuration
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
// for now we just use local variable to store the data instead of mongodb
const arr = [];
app.use(cors());
dotenv.config();

const client = new MongoClient(process.env.mongourl);
const db = client.db('shorturls');
const orgUrls = db.collection('urls')


app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// for doing this url shortner task we use body-parser to parse the body and also url
// app.post("/api/shorturl", (req, res) => {
//   console.log(req.body, " ------- req.body");
//   // let originalURL = "www.example.com";
//   // console.log("Hello");
//   // console.log(urlObject.hostname, " ========= 1");
//   // console.log(urlObject, " ------------- 2");
//   // );
//   try {
//     const urlObject = new URL(req.body.url);
//     arr.push({ originalUrl: req.body.url });
//     res.json({
//       original_url: req.body.url,
//       short_url: arr.length,
//     });
//   } catch (err) {
//     res.json({ error: "Invalid URL" });
//   }
// });

// another way to do this is using dns and urlparser and mongodb
app.post('/api/shorturl', (req,res) => {
  // her we check for the given url is actially a valid url or not
  console.log(req.body, ' ------- req.body -----');
  dns.lookup(urlparser.parse(req.body.url).hostname, async (err, address) => {
    if(!address) {
      return res.json({ error: "Invalid URL" });
    }
    else {
      const shortId = await orgUrls.countDocuments() + 1;
      console.log(shortId);
      await orgUrls.insertOne({originalUrl: req.body.url, shortId})
      res.json({
        "original_url": req.body.url,
        "short_url": shortId
      })
    }
  })
  // res.send("Hello");
})

// for redirecting to original site through shorturl
// app.get("/api/shorturl/:id", (req, res) => {
//   console.log(req.params, " --------- params ---");
//   // return res.redirect("http://www.google.com");
//   res.redirect(arr[req.params.id - 1].originalUrl);
// });

// we can get the data redirecting url from mongodb for get req
app.get('/api/shorturl/:id', async (req,res) => {
  console.log(req.params.id, ' ------------ id -----');
  const redirectUrl = await orgUrls.findOne({shortId: +req.params.id});
  if(!redirectUrl) res.redirect(redirectUrl.originalUrl);
  else res.json({error: "Invalid short_url"});
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
