// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   secure: false,
//   auth: {
//     user: "kumarakash91384@gmail.com",
//     pass: "snhozmkpemzwdojg",
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function sendMail(to, subject, text, html) {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: 'kumarakash91384@gmail.com', 
//     to,
//     subject,
//     text,
//     html,
//   });
// }

// module.exports = { sendMail }

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",   
  port: 587,               
  secure: false,            
  auth: {
    user: "kumarakash91384@gmail.com",    
    pass: "snhozmkpemzwdojg",             
  },
  tls: {
    rejectUnauthorized: false             
  }
});

// Email sending function using async/await
async function sendMail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: '"Your Name" <kumarakash91384@gmail.com>',  
      to,                                               
      subject,                                          
      text,                                             
      html,                                             
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

module.exports = { sendMail };
