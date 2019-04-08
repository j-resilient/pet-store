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

// species, gender, trait
app.use('/findAnimal', (req, res) => {
  if (req.query !== undefined) {
    let query = {};
    if (req.query.species) {
      query.species = req.query.species;
    }
    if (req.query.gender) {
      query.gender = req.query.gender;
    }
    if (req.query.trait) {
      query['traits'] = req.query.trait;
    }

    // id still displays despite my ongoing efforts
    Animal.find(query, (err, animals) => {
      if (!err) {
        animals.forEach((a) => {
          delete a['_id'];
          a.traits = undefined;
        })
        res.json(animals);
      }
    })
  }
  else {
    res.json({})
  }
});

app.use('/animalsYoungerThan', (req, res) => {
  if (req.query !== undefined && req.query.age) {
    const age = Number(req.query.age);
    let young;
    let names = [];
    if (!isNaN(age)) {
      Animal.find( (err, animals) => {
        if (!err) {
          young = animals.filter(a => a.age < age);
          young.forEach((y) => names.push(y.name));

          young.length === 0 ?
            res.json({Count: 0}) :
            res.json({Count: young.length, Names: names});
        }
      })
    }
    // age is not a number
    else {
      res.json({});
    }
  }
  else {
    res.json({});
  }
})

app.use('/calculatePrice', (req, res) => {
  if (req.query && req.query.id && req.query.qty
     && req.query.id.length === req.query.qty.length ) {
    let total = 0;
    let items = [];

    // create array of objects with ids and quantities
    req.query.id.forEach((toy, index) => {
      items.push({item: toy, qty: req.query.qty[index]});
    });

    // add subtotals to items array
    items.forEach((current, index) => {
      Toy.find(current.item, (err, toys) => {
        if (!err) {
          console.log(toys);
          items[index].subtotal = toys.price * items[index].qty;
        }
      })
    })
    console.log(items);
  }
  // there are no query parameters or the wrong number/type of parameters
  else {
    res.json({});
  }
})

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
