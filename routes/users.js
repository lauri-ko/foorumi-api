var express = require('express');
var router = express.Router();

var Models = require('../models');

// Huom! Kaikki polut alkavat polulla /users

// POST /users
router.post('/', function(req, res, next){
  // Lisää tämä käyttäjä (Vinkki: create), muista kuitenkin sitä ennen varmistaa, että käyttäjänimi ei ole jo käytössä! (Vinkki: findOne)
  var userToAdd = req.body;
  // Palauta vastauksena lisätty käyttäjä
  Models.User.findOne({
    where: {
      username: userToAdd.username
    }
  }).then((user) => {
    if(user) {
      res.status(400).json({ error: "Käyttäjätunnus on jo olemassa!" });
    } else {
      // VAROITUS: salasana on talletettu selkokielisenä!
      Models.User.create(userToAdd).then(function(user){
        res.json(user);
      });
    }
  })
});

// POST /users/authenticate
router.post('/authenticate', function(req, res, next){
  // Tarkista käyttäjän kirjautuminen tässä. Tee se katsomalla, löytyykö käyttäjää annetulla käyttäjätunnuksella ja salasanalla (Vinkki: findOne ja sopiva where)
  var userToCheck = req.body;
  Models.User.findOne({
    where: {
      username: userToCheck.username,
      password: userToCheck.password
    }
  }).then((user) => {
      if(user) {
        req.session.userId = user.id;
        res.json(user);
      } else {
        res.sendStatus(403);
      }
    });
});

// GET /users/logged-in
router.get('/logged-in', function(req, res, next){
  var loggedInId = req.session.userId ? req.session.userId : null;

  if(loggedInId == null) {
    res.json({});
  } else {
    // Hae käyttäjä loggedInId-muuttujan arvon perusteella (Vinkki: findOne)
    Models.User.findOne({
      where: { id: loggedInId }
    }).then((user) => { res.json(user) });
  }
});

// GET /users/logout
router.get('/logout', function(req, res, next){
  req.session.userId = null;

  res.send(200);
});

module.exports = router;
