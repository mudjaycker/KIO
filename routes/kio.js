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

class WariRoute {
  constructor() {
    this.request;
    this.results;
    this.response;
    this.password;
    this.textPassword;

    this.phoneNumber;
    this.serviceCode;
    this.sessionId;
    this.networkCode;

    this.ussdCases = new Map();
    this.ussdCases.set("", this.sendMenu1());
    this.ussdCases.set("0", this.sendMenu1());
    this.ussdCases.set("1", this.PasswordForSolde(this.textPassword));
    this.ussdCases.set("2", this.sendMenu2());
    this.ussdCases.set("3", this.newAccount());

    this.ussdCases.set("1*0", this.sendMenu1());
    this.ussdCases.set("1*" + this.password, this.getSolde());

    this.ussdCases.set("2*0", this.sendMenu2());
    this.ussdCases.set("2*1", this.wari());
    this.ussdCases.set("2*2", this.worldRemit());
    this.ussdCases.set("2*3", this.canalPlus());
    this.ussdCases.set("2*4", this.vochers());
    this.ussdCases.set("2*5", this.motoAutoAssurance());
  }

  sendMenu1() {
    this.response = `CON Welcome in your KIO mobile money what do you want to do
    1- Get my balance account
    2- Services
    3- create an account if not exists`;
  }

  async PasswordForSolde(textPassword) {
    let testPassword = subword(textPassword, 2);
    let passwordExists = await User.exists({
      password: testPassword,
    });
    if (passwordExists) {
      this.password = testPassword;
      resp = `END your balance account is ...`;
    } else resp = `END this account does not exist or incorrect password`;
  }

  sendMenu2() {
    this.response = `CON welcome to services make your choice
    1- WAARI
    2- World remit
    3- Canal+
    3- Buy vochers
    5- Moto assurance`;
  }

  wari() {}
}
