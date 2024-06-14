"use strict";

const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (user, res) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: user.email,
    subject: "Password retrieval request",
    text: "This email is coming to you because you requested password retrieval",
    html: emailTemplate(user),
  };
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        const message = `Check your internet connection, ${error.message}`;
        return res.status(400).send({ message });
      }
      console.log({ infoResponse: info.response });
      console.log("\n Email sent");
      return res.status(200).json({ message: "Password sent to your email" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const url = process.env.BASE_URL;
const projectUrl = process.env.PROJECT_URL;
const appTitle = process.env.APP_TITLE;

const emailTemplate = (user) => {
  return `
    <!DOCTYPE html>
    <html lang="en-US">
    <head>
      <meta charset="UTF-8">
      <title>Reset Password Email Template</title>
      <meta name="description" content="Reset Password Email Template.">
      <style>
        a:hover {
          text-decoration: underline !important;
        }
        .eMail-body { font-family: 'Arial', sans-serif; }
        .main-table { width: 100%; }
        .eMail-table { margin: auto; }
        .message-title { font-size: 24px; font-weight: bold; }
        .request-retrieve { font-size: 20px; font-weight: bold; }
        .email-password { font-size: 16px; }
        .login-url { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; }
        .slogan { font-size: 14px; }
        .copyright { font-size: 12px; }
      </style>
      <link href="sendEmail.css" rel="stylesheet">
    </head>
    <body class="eMail-body">
      <!--100% body table-->
      <table class="main-table">
        <tr>
          <td>
            <table class="eMail-table">
              <tr>
                <td style="height:80px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="text-align:center;">
                  <a href="${projectUrl}" title="logo" target="_blank">
                    <span class="message-title">${appTitle}</span>
                  </a>
                </td>
              </tr>
              <tr>
                <td style="height:20px;">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <table class="message-table">
                    <tr>
                      <td style="height:40px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td style="padding:0 35px;">
                        <h1 class="request-retrieve">
                          You have requested to retrieve your password
                        </h1>
                        <span class="separator"></span>
                        <p class="email-password">
                          Your login details are shown below <br>
                          Email: ${user.email}
                          <br> Password: ${user.password}
                        </p>
                        <a href="${url}" class="login-url">
                          Click Here to Login
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="height:40px;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              <tr>
                <td style="height:20px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="text-align:center;">
                  <p class="slogan">
                    <strong>${appTitle}. Connecting People</strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="text-align:center;">
                  <p class="copyright">
                    &copy; <strong>${appTitle} Team</strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="height:80px;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--/100% body table-->
    </body>
    </html>
  `;
};

const loginTemplate = (user) => {
  return `
    <p>Your login details are shown below:<br>
    Email: ${user.email}<br>
    Password: ${user.password}<br>
    <a href="${url}">Click Here to Login</a>
    </p>
  `;
};

module.exports = { sendEmail, emailTemplate, loginTemplate };
