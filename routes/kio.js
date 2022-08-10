const express = require("express");
const router = express.Router();
const KioObject = require("./kioObject");
const KioUserService = require("./kioUserServices");

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

  await route.run(res);
  res.send(route.response);
});

router.post("/kio/user-services", async (req, res) => {
  let routeUser = new KioUserService();
  let { phoneNumber, serviceCode, text, sessionId, networkCode } = req.body;
  [routeUser.phoneNumber, routeUser.text] = [phoneNumber, text];
  await routeUser.run();
  res.send(routeUser.response);
});
module.exports = router;
