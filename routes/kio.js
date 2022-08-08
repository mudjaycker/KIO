const express = require("express");
const router = express.Router();
const User = require("../models/kio");

const thirdPartsUrl = "http://127.0.0.1:5000/api";

const {
  subword,
  checkIfUserExist,
  getKioUser,
  excludeChar,
} = require("./_scripts");

class KioRoute {
  constructor() {
    this.thirdPartsUrl = "http://127.0.0.1:5000/api";

    this.request;
    this.results;
    this.response;
    this.password;
    this.text;

    this.phoneNumber;
    this.serviceCode;
    this.sessionId;
    this.networkCode;

    // map to manage ussd cases
    this.ussdCases = new Map();
    this.ussdCases.set("", () => this.askForPassword());
  }

  sendMenu1() {
    this.response = `CON 1- Get my balance account
    2- Services
    3- create an account if not exists`;
  }

  async whenAuthentified() {
    const users = await User.find();
    let userExists;
    let p;
    users.forEach((user) => {
      if (this.text.includes(user.password) && user.phoneNumber == this.phoneNumber) {
        this.password = user.password;
        p = this.password

        userExists = true;
        // proctected action need auth to be done
        this.ussdCases.set(this.password + "*1", () => this.balanceSolde());
        this.ussdCases.set(this.password + "*1*0", () => this.sendMenu1());
        this.ussdCases.set(this.password + "*2", () => this.sendMenu2());
        this.ussdCases.set(this.password + "*1*0", () => this.sendMenu1());
        this.ussdCases.set(this.password + "*1*" + this.password, () => this.sendMenu1());
        this.ussdCases.set(this.password + "*2*0", () => this.sendMenu2());
        this.ussdCases.set(this.password + "*2*1",  () => this.wari());
      } else {
        userExists = false;
        p = "unknown password";
      }
    });
    return [userExists, p];
  }
  async balanceSolde(){
      const user = await User.findOne({ phoneNumber: this.phoneNumber, password: this.password})
      this.response = `Your balance is ${user.balance} fbu`
  }
  
  askForPassword() {
    this.response = `CON first enter your password`;
  }

  sendMenu2() {
    this.response = `CON welcome to services make your choice
    1- WAARI
    2- World remit
    3- Canal+
    3- Buy vochers
    5- Moto assurance`;
  }

  async wari() {
    let thirdPartUserExists = await checkIfUserExist(
      this.thirdPartsUrl + "/user/" + this.phoneNumber
    );
    console.log("in wari");
    if (thirdPartUserExists[0]) {
      this.response = `CON 1 - send money`;
    } else {
      this.response = `This wari users does not exist`;
    }
  }
}

router.post("/kio/wari", async (req, res) => {
  let route = new KioRoute();
  let { phoneNumber, serviceCode, text, sessionId, networkCode } = req.body;
  route.phoneNumber = phoneNumber;
  route.serviceCode = serviceCode;
  route.sessionId = sessionId;
  route.networkCode = networkCode;

  route.text = text;
  if (text == "") {
  await route.ussdCases.get("")();
  }
  if ((await route.whenAuthentified()) != [] && route.text.length >= 4) {
    if (route.text == route.password) {
      route.sendMenu1()
    } else {
     await route.ussdCases.get(route.text)();
    }
  }
 
  res.send(route.response);
});
module.exports = router;
