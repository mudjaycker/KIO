const axios = require("axios");
module.exports = {
  subword: function (text, start, end) {
    let text_res = "";
    for (let i = start; i <= end; i++) {
      text_res += text[i];
    }
    return text_res;
  },
  excludeChar: function (text, char) {
    let s = "";
    for (i of text) {
      if (i !== char) {
        s += i;
      } else if (char == "*") {
        break;
      }
    }
    return s;
  },

  checkIfUserExist: async function (url) {
    let bool;
    let resp;
    await axios
      .get(url)
      .then((res) => {
        bool = true;
        resp = res;
      })
      .catch((err) => {
        bool = false;
        resp = err;
      });
    return [bool, resp];
  },

  getKioUser: async function (Instance, phoneNumber) {
    user = await Instance.find({ phoneNumber: phoneNumber });
    return user;
  },
};
