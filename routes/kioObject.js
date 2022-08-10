const User = require("../models/kio");
const thirdPartsUrl = "http://127.0.0.1:5000/api";
const { checkIfUserExist } = require("./_scripts");

class KioObject {
  constructor() {
    this.thirdPartsUrl = "http://127.0.0.1:5000/api";

    this.request;
    this.results;
    this.response;
    this.password;
    this.text;
    this.textPassword;

    this.phoneNumber;
    this.serviceCode;
    this.sessionId;
    this.networkCode;

    // map to manage ussd cases
    this.ussdCases = new Map();
    this.ussdCases.set("", () => this.askForPassword());
  }

  askForPassword() {
    this.response = `CON enter your account passsword please`
  }

  sendMenu1() {
    this.response = `CON 1- Get my balance account
    2- Services
    3- user services`;
  }

  sendMenu2() {
    this.response = `CON welcome to services make your choice
    1- WAARI
    2- World remit
    3- Canal+
    3- Buy vochers
    5- Moto assurance`;
  }

  async whenAuthentified() {
    const users = await User.find();
    let userExists;
    users.forEach((user) => {
      if (
        this.text.includes(user.password) &&
        user.phoneNumber == this.phoneNumber
      ) {
        this.password = user.password;

        userExists = true;
        // console.log(user);
        // proctected action need auth to be done
        this.ussdCases.set(this.password + "*1", () => this.balanceSolde());
        this.ussdCases.set(this.password + "*2", () => this.sendMenu2());
        this.ussdCases.set(this.password + "*1*0", () => this.sendMenu1());
        this.ussdCases.set(this.password + "*1*" + this.password, () =>
          this.sendMenu1()
        );
        this.ussdCases.set(this.password + "*2*0", () => this.sendMenu2());
        this.ussdCases.set(this.password + "*2*1", () => this.wari());
      } else {
        userExists = false;
      }
    });
    return userExists;
  }
  async balanceSolde() {
    const user = await User.findOne({
      phoneNumber: this.phoneNumber,
      password: this.password,
    });
    this.response = `Your balance is ${user.balance} fbu`;
  }

  async wari() {
    let thirdPartUserExists = await checkIfUserExist(
      thirdPartsUrl + "/user/" + this.phoneNumber
    );
    if (thirdPartUserExists[0]) {
      this.response = `CON 1 - send money`;
    } else {
      this.response = `This wari users does not exist`;
    }
  }

  async run(res) {
    if (this.text == "") {
      await this.ussdCases.get("")();
    } else if (this.text != "") {
      if (await this.whenAuthentified()) {
        if (this.text == this.password) {
          this.sendMenu1();
        } else {
          await this.ussdCases.get(this.text)();
        }
      } else if (this.text == "3") {
        res.redirect(200, "kio/user-services");
      } else {
        this.response = "END bad code";
      }
    }
  }
}

module.exports = KioObject;
