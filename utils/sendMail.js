const emailjs = require("@emailjs/nodejs");
const sendMail = (data) => {
  console.log("sent");
  emailjs
    .send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      data,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (err) {
        console.log("FAILED...", err);
      }
    );
};

module.exports = sendMail;
