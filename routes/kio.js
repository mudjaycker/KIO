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
    this.response = `CON Welcome in your KIO mobile money what do you want to do
    1- Get my balance account
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
        console.log(user);
        userExists = true;
        // proctected action need auth to be done
        this.ussdCases.set(this.password + "*1", () => this.sendMenu1());
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
  async askForPassword() {
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
    let thirdPartiesUserExists = await checkIfUserExist(
      this.thirdPartiesUrl + "/user/" + this.phoneNumber
    );
    if (thirdPartiesUserExists[0]) {
      this.response = `CON 1 - send money`;
    } else {
      this.response = `This wari user does not exist`;
    }
  }
}
