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
      else {
        res.type('html').status(500);
        res.send('Error: ' + err);
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
    let ids = [];

    // create array of objects with ids and quantities
    req.query.id.forEach((toy, index) => {
      items.push({item: toy, qty: req.query.qty[index], subtotal: 0});
      ids.push({id: toy});
    });

    let query = Toy.find({})
    query.or(ids);
    query.exec(function (err, toys) {
      for (let index = 0; index < items.length; index++) {
        const i = toys.findIndex((element) => {
          return element.id === items[index].item;
        });

        if (i !== -1 && !isNaN(items[index].qty) && !isNaN(items[index].item) && items[index].qty >= 1)  {
          console.log('not deleting');
          items[index].subtotal = toys[i].price * items[index].qty;
          total += items[index].subtotal;
        }
        else {
          // remove id (current element) from array
          items.splice(index, 1);
          index--;
        }
      }
      res.json({totalPrice: total, items: items});
    });
  }
  // there are no query parameters or the wrong number/type of parameters
  else {
    res.json({});
  }
})

app.use('/', (req, res) => {
  res.json({});
});
app.listen(3000, () => {
  console.log('Listening on port 3000');
});

// Please do not delete the following line; we need it for testing!
module.exports = app;
