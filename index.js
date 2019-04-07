/* node index.js */

var express = require('express');
var app = express();

app.set('view engine', 'ejs');

var Animal = require('./Animal.js');
var Toy = require('./Toy.js');

app.use('/findToy', (req, res) => {
  if (req.query.id !== undefined) {
    Toy.find({id: req.query.id }, (err, toys) => {
      if (!err) {
        res.json(toys);
      }
      else {
        res.json({});
      }
    });
  }
  // empty query:
  else {
    res.json({});
  }
});

app.use('/displayToys', (req, res) => {
  Toy.find( (err, toys) => {
    if (!err) {
      res.json(toys);
    }
  });
});

app.use('/', (req, res) => {
  Animal.find( (err, allAnimals) => {
    if (err) {
      res.type('html').status(500);
      res.send('Error: ' + err);
    }
    else if (allAnimals.length === 0) {
      res.type('html').status(200);
      res.send('There are no animals.');
    }
    else {
      res.render('showAll', { animals: allAnimals });
    }
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

// Please do not delete the following line; we need it for testing!
module.exports = app;
