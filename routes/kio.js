const express = require("express");
const router = express.Router();
const KioObject = require("./kioObject");
const fs = require("fs");


router.post("/kio/wari", async (req, res) => {
  let route = new KioObject();
  let { phoneNumber, serviceCode, text, sessionId, networkCode } = req.body;
  [
    route.phoneNumber,
    route.serviceCode,
    route.text,
    route.sessionId,
    route.networkCode,
  ] = [phoneNumber, serviceCode, text, sessionId, networkCode];

  route.text = text;
  let userTempo = JSON.parse(fs.readFileSync("userTempo.json"));
  console.log(
    route.text.includes(userTempo.password + "*" + userTempo.password)
  );

  if (text == "") {
    await route.ussdCases.get("")();
  }
 else if (route.text != "") {
    if (
      (await route.whenAuthentified()) &&
      route.text.length >= 4 &&
      route.text.length < 9
    ) {
      if (route.text == route.password) {
        route.sendMenu1();
      } else {
        await route.ussdCases.get(route.text)();
      }
    }
    else {
      route.response = "END bad code"
    }
  } 
  res.send(route.response);
});
module.exports = router;
