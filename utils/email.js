const nodemailer=require("nodemailer");

const sendEmail=async (options)=>{
    //create transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6d25ba35cd04bd",
          pass: "91dd5e77b2acbc"
        }
      });
    const mailOption={
        from:"mohammad bibakiyan <mohammad@gmail.com>",
        to:options.email,
        subject:options.subject,
        text:options.message
    };
    await transporter.sendMail(mailOption);
};
module.exports=sendEmail;