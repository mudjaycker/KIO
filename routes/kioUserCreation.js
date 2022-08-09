const { subword } = require("./_scripts");
const User = require("../models/kio");
const fs = require("fs");
class KioUserCreation {
  constructor() {
    this.text = "";
    this.response;
    this.password;
    this.passwordTest;
    this.balance
    this.phoneNumber;
    this.username;
    this.userCreation = new Map();
    this.userCreation.set("", () => this.sendMenu());
    this.userCreation.set("1", () => this.askForUserPassword());
    this.userCreation.set("2", () => this.newUserPassword());
  }

  async whenAuthentified() {
    const users = await User.find();
    let userExists
    users.forEach((user) => {
      if (this.text.includes(user.password) && user.phoneNumber == this.phoneNumber) {
        this.username = user.username
        this.balance = user.balance
        userExists = true
      }else userExists = false
})
    return userExists
}

  sendMenu() {
    this.response = `CON Welcome to kio user management
        1- See your account
        2- create a new account
        3- Update an account`;
  }

  newUserPassword() {
    this.response = `CON Welcome to kio user creation ...
        type the password of your new account`;
  }

  askForUserPassword() {
    this.response = `CON type your password`;
  }

  async save(userOBJ) {
    const user = User(userOBJ);
    await user.save();
  }

  async run() {
    if (this.text.startsWith("2*")) {
      if (this.text.length == 6) {
        this.passwordTest = subword(this.text, 2, this.text.length);
        this.textPassword = this.text;
        let userTempo = {
          phoneNumber: this.phoneNumber,
          passwordTest: this.passwordTest,
        };
        fs.writeFileSync("userTempo.json", JSON.stringify(userTempo));
      } else if (this.text == 11) {
        let userFile = fs.readFileSync("userTempo.json");
        let _userTempo = JSON.parse(userFile);
        if (
          this.text == `2*${_userTempo.passwordTest}*${_userTempo.passwordTest}`
        ) {
          const user = { ..._userTempo, balance: 0 };
          await this.save(user);
        }
      }
    }
    if(this.whenAuthentified()){
        this.response = `END your phoneNumber is ${this.phoneNumber}
        your username is ${this.username}
        your balance is ${this.balance}`
    }
  }
}
