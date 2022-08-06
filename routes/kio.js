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

    this.phoneNumber;
    this.serviceCode;
    this.sessionId;
    this.networkCode;
    this.password;

    this.ussdCases = new Map();
    this.ussdCases.set("", this.sendMenu1());
    this.ussdCases.set("1", this.PasswordForSolde());
    this.ussdCases.set("2", this.sendServices());
    this.ussdCases.set("3", this.newAccount());

    this.ussdCases.set("1*0", this.sendMenu1());
    this.ussdCases.set("1*" + this.password, this.getSolde());

    this.ussdCases.set("2", this.sendMenu2());
    this.ussdCases.set("2*0", this.sendMenu1());
    this.ussdCases.set("2*1", this.wari());
    this.ussdCases.set("2*2", this.worldRemit());
    this.ussdCases.set("2*3", this.canalPlus());
    this.ussdCases.set("2*4", this.vochers());
    this.ussdCases.set("2*5", this.motoAutoAssurance());
  }

  sendMenu1() {
    this.response = `CON Login to your account
    tape your password`;
  }
}
