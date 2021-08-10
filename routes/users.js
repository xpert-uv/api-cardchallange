var express = require('express');

var router = express.Router();
const User = require("../module/User");
const axios = require("axios");

/* GET users listing. */
/**
 * singup user and responde with user id 
 * and six cards. 
 */
router.post("/register",  async function (req, res, next) {
  try {
    
    const user = await User.register(req.body);
    const deckOfCards = await axios.get("https://deckofcardsapi.com/api/deck/new/draw/?count=6");
    const response = {
      users: user,
    cards:deckOfCards.data}
    //const cards = deckOfCards.data;
    return res.status(201).json(response  );
  } catch (err) {
    return next(err);
  }
});

/**
 * login user and response with user id 
 * and cards only need six cards. 
 */

router.post("/login", async (req, res, next) => {

  try {
    
    const user = await User.userAuthenticate(req.body);
    const deckOfCards = await axios.get("https://deckofcardsapi.com/api/deck/new/draw/?count=6");
    const response = {
      users: user,
    cards:deckOfCards.data}
    //const cards = deckOfCards.data;
    return res.status(200).json(response  );

   } catch (err) {
    return next(err)
  }
  
})

router.get("/shuffel", async (req, res, next) => {
  try {
     const deckOfCards = await axios.get(`https://deckofcardsapi.com/api/deck/${req.body.deck_id}/shuffle/`);
  const deck_id = deckOfCards?.data["deck_id"];
  const drawAgain = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=6`)
  return res.status(200).json(drawAgain.data);
  } catch (err) {
    next(err);
  }
 
})

module.exports = router;
