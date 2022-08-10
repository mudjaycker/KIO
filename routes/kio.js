const express = require("express");
const router = express.Router();
const KioObject = require("./kioObject");
const KioUserService = require("./kioUserServices")
const fs = require("fs");


router.post("/kio", async (req, res) => {
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
  if (text == "") {
    await route.ussdCases.get("")();
  }
 else if (route.text != "") {
    if (
      (await route.whenAuthentified()) 
    ) {
      if (route.text == route.password) {
        route.sendMenu1();
      } else {
        await route.ussdCases.get(route.text)();
      }
    }
  else if(route.text == "3"){
    res.redirect(200, "kio/user-services")
  }
    else {
      route.response = "END bad code"
    }
  } 
  res.send(route.response);
});

router.post("/kio/user-services", async(req, res)=>{
  let routeUser = new KioUserService()
  let { phoneNumber, serviceCode, text, sessionId, networkCode } = req.body;
  [routeUser.phoneNumber, routeUser.text] = [phoneNumber, text]
   routeUser.run()
  res.send(routeUser.response)
})
module.exports = router;
