const express = require("express");
const router = express.Router();
const User = require("../models/kio");

const { subword } = require("./_scripts");

router.post("/kio", async (req, res) => {
  let resp;
  var { phoneNumber, serviceCode, text, sessionId, networkCode } = req.body;

  if (text == "") {
    resp = `CON Login to your account
    tape your password`;
  }
  var userExists = await User.exists({
    phoneNumber: phoneNumber,
    password: text,
  });

  if (text == "") {
    resp = `CON Welcome in your KIO mobile money what do you want to do
    1- Get my balance account
    2- Services
    3- create an account if not exists`;
    
  } else if (text == "1") {
    resp = `CON enter your password please`;
  } else if (text[0] == "1" && text[1] == "*") {
    const passwordText = subword(text, 2);
    let passwordExists = await User.exists({ password: passwordText });

    if (passwordExists) resp = `END your balance account is ...`;
    if (passwordExists == null)
      resp = `END this account does not exist or incorrect password`;
  } else if (text == "2") {
    resp = `END welcome to services`;
  }

  res.send(resp);
});

module.exports = router;
