
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const uri = process.env.DB_URI;

mongoose.set('debug', true);

app.listen(8000);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

function distinctValuesResearch(db, selectors, propriete, callback) {
  db.collection("Products").distinct(propriete, function (err, documents) {
    if (err) selectors.push({ "name": propriete, "values": [] });
    else if (documents !== undefined) {
      let values = [];
      if (propriete == "price") {
        let min = Math.min.apply(null, documents);
        let max = Math.max.apply(null, documents);
        let minTranche = Math.floor(min / 100) * 100;
        let maxTranche = minTranche + 99;
        values.push(minTranche + " - " + maxTranche);
        while (max > maxTranche) {
          minTranche += 100;
          maxTranche += 100;
          values.push(minTranche + " - " + maxTranche);
        }
        selectors.push({ "name": propriete, "values": values });
      }
      else selectors.push({ "name": propriete, "values": documents.sort() });
    }
    else selectors.push({ "name": propriete, "values": [] });
    callback(selectors);
  });
};

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

  app.get('/research/product/:id', (req, res, next) => {
    const id = req.params.id;

    db.collection('Products').findOne({ '_id': ObjectId(id) })
      .then(async (product) => {
        try {
          if (!product) {
            return res.status(404).send({
              message: 'Product not found!'
            });
          }

          res.setHeader("Content-type", "application/json; charset=UTF-8");
          res.end(JSON.stringify(product));
        } catch (err) {
          return res.status(500).send({
            message: 'Something wrent wrong!'
          });
        }
      }
      )
      .catch(next);
  })

  app.get("/research/keywords", (req, res, next) => {
    const search = [];

    for (el in req.query) {
      search.push(el);
    }

    db.collection('Products').find({}).toArray((err, documents) => {
      const check = new RegExp(search[0], "i");
      const results = [];

      documents.forEach(product => {
        for (el in product) {
          if (check.test(product[el])) {
            results.push(product)
            break;
          }
        }
      })

      res.setHeader("Content-type", "application/json; charset=UTF-8");
      let json = JSON.stringify(results);
      res.end(json);
    })
  });

  app.get("/research/selectors", (req, res, next) => {
    distinctValuesResearch(db, [], "type", function (selectors) {
      distinctValuesResearch(db, selectors, "brand", function (selectors) {
        distinctValuesResearch(db, selectors, "price", function (selectors) {
          distinctValuesResearch(db, selectors, "popularity", function (selectors) {
            let json = JSON.stringify(selectors);
            res.setHeader("Content-type", "application/json; charset=UTF-8");
            res.end(json);
          });
        });
      });
    });
  });

  app.get("/research/:type/:brand/:minprice/:maxprice/:minpopularity", (req, res, next) => {

    let filterObject = {};
    if (req.params.type != "*") { filterObject.type = req.params.type; }
    if (req.params.brand != "*") { filterObject.brand = req.params.brand; }
    if (req.params.minprice != "*" || req.params.maxprice != "*") {
      filterObject.price = {};
      if (req.params.minprice != "*") filterObject.price.$gte = parseInt(req.params.minprice);
      if (req.params.maxprice != "*") filterObject.price.$lte = parseInt(req.params.maxprice);
    }
    if (req.params.minpopularity != "*") {
      filterObject.popularity = { $gte: parseInt(req.params.minpopularity) };
    }
    //console.dir(filterObject);

    db.collection('Products').find(filterObject).toArray((err, docs) => {
      const results = JSON.stringify(docs);

      res.setHeader("Content-type", "application/json; charset=UTF-8");
      res.end(results);
    })
  });


  app.post('/users/authenticate', (req, res, next) => {
    const { password, username } = req.body;

    db.collection('Users').findOne({ username: username, password: password })
      .then(async (user) => {
        try {
          if (!user) {
            return res.status(500).send(({
              message: 'Login &/or password are invalid.'
            }));
          }
          res.setHeader("Content-type", "application/json; charset=UTF-8");
          res.end(JSON.stringify(user));
        } catch (err) {
          return res.status(500).send({
            message: 'This is an error!'
          });
        }
      }).catch(next);
  });

  app.post('/users/register', (req, res, next) => {
    const { firstname, lastname, username, password, email } = req.body;

    db.collection('Users').findOne({ firstname, lastname, password, username, email })
      .then(async (user) => {
        try {
          if (!user) {
            db.collection('Users').insertOne({ firstname, lastname, username, password, email })
              .then(data => {
                res.setHeader("Content-type", "application/json; charset=UTF-8");
                res.end(JSON.stringify(data));
              })
              .catch(next);
          } else {
            return res.status(404).send({
              message: 'User already exist.'
            });
          }
        } catch (err) {
          return res.status(500).send({
            message: 'Unknown error try again later.'
          });
        }
      }).catch(next);
  });

  app.post('/users/cartCreation', async (req, res, next) => {
    const { firstname, lastname, username, password, email } = req.body;

    await db.collection('Carts').findOne({ email: email })
      .then(async data => {
        try {
          if(!data) {
            const user = await db.collection('Carts').insertOne({ firstname, email, lastname, order: [] });

            res.setHeader("Content-type", "application/json; charset=UTF-8");
            res.end(JSON.stringify(user));
          }
        } catch (err) {
          return res.status(400).send({
            message: 'Something went wrong!',
            infos: { message: err.message }
          })
        }
      }).catch(next);
  })

  // CART MANAGEMENT

  app.get("/CartProducts/products/:email", (req, res) => {
    let email = req.params.email;

    db.collection("Carts").find({ email: email }).toArray(function (err, documents) {
      let json;
      console.log('DOCUMENTS :', documents)
      if (documents !== undefined && documents[0] !== undefined) {
        let productsInE = documents[0].order;
        let productsInI = {};
        for (let product of productsInE) {
          if (product._id in productsInI) {
            productsInI[product._id].nb++;
          }
          else {
            productsInI[product._id] = {
              "_id": product._id, "type": product.type, "brand": product.brand, "name": product.name,
              "popularity": product.popularity, "price": product.price, "nb": 1
            };
          }
        }

        let productList = [];
        for (let productId in productsInI) {
          productList.push(productsInI[productId]);
        }
        json = JSON.stringify(productList);

        console.log('DOCUMENTS :', documents)
      }
      else json = JSON.stringify([]);
      res.setHeader("Content-type", "application/json; charset=UTF-8");
      res.end(json);
    });
  });

  app.get('/products/:email', (req, res, next) => {
    const { email } = req.params;

    db.collection('Carts').findOne({ email: email })
      .then(async (cart) => {
        try {
          if (!cart) {
            return res.status(404).send({
              message: 'No products for this cart!'
            })
          } else {
            return res.status(200).send(JSON.stringify(cart.order));
          }
        } catch (err) {
          return res.status(500).send({
            message: 'Something went wrong!'
          })
        }
      })
      .catch(next);
  });

  app.post(`/cart/products`, async (req, res, next) => {
    const { email, productId } = req.body;

    db.collection('Carts').find({ email: email }).toArray(async (err, documents) => {
      if (documents !== undefined && documents[0] !== undefined) {
        let order = documents[0].order;
        let product = await db.collection('Products').findOne({ '_id': ObjectId(productId) });

        order.push(product);
        await db.collection('Carts').update({ email: email }, { $set: { order: order } });

        return res.status(200).send(JSON.stringify(order));
      }
    })
  });

  app.delete('/cart/:productId/:email', async (req, res, next) => {
    const { email, productId } = req.params;
    const product = await db.collection('Products').findOne({ '_id': ObjectId(productId) });

    db.collection('Carts').find({ email: email }).toArray(async (err, documents) => {
      if (documents !== undefined && documents[0] !== undefined) {
        let order = documents[0].order;
        order.splice(product, 1);

        await db.collection('Carts').updateOne({ email: email }, { $set: { order: order } });
        return res.status(200).send(JSON.stringify(order));
      }
    })
  })

  app.use((err, req, res, next) => {
    res.send({ error: err.message })
  })

  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
  
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
      console.log("💥 Process terminated!");
    });
  });
});