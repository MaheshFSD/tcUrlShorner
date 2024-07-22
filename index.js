require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const URL = require('url').URL
// Basic Configuration
const port = process.env.PORT || 3000;

// for now we just use local variable to store the data instead of mongodb
const arr = [];
app.use(cors());

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

app.post("/api/shorturl", (req, res) => {
  console.log(req.body, " ------- req.body");
  // let originalURL = "www.example.com";
  // console.log("Hello");
  // console.log(urlObject.hostname, " ========= 1");
  // console.log(urlObject, " ------------- 2");
  // );
  try {
    const urlObject = new URL(req.body.url);
    arr.push({ originalUrl: req.body.url });
    res.json({
      original_url: req.body.url,
      short_url: arr.length,
    });
  } catch (err) {
    res.json({ error: "Invalid URL" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
