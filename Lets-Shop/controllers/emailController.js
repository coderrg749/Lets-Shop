"use strict";
const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')
const sendMail = asyncHandler(async(data,req,res)=>{
    const nodemailer = require("nodemailer");
    console.log(process.env.MAIL,process.env.MPASS)
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.protonmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL,
          pass: process.env.MPASS,
      }
    });
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <rajanxyz.protonmail.com>', // sender address
        to: data.to,
        subject: data.subject, // Subject line
        text: data.text,
        html:data.html
      });
    
      console.log("Message sent: %s", info.messageId);
   
    }
    
    main().catch(console.error);
    




})
module.exports= sendMail;