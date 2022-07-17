const nodemailer=require("nodemailer");
const pug=require("pug");
const htmlToText=require("html-to-text");

module.exports=class Email{
  constructor(user,url){
    this.name=user.name.split(" ")[0],
    this.to=user.email,
    this.from="mohammad bibakiyan <mohammad@gmail.com>",
    this.url=url
  }

  newTransporter(){
    //use ... in production mode
    if(process.env.NODE_ENV==="production"){
      return
    }
    //use mailtrap in develop mode
    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "6d25ba35cd04bd",
        pass: "91dd5e77b2acbc"
      }
    });
  }

  async send(template,subject){
    //render html from pug
    const html=pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
      name:this.name,
      url:this.url,
      subject,
    })
    const mailOption={
      from:this.from,
      to:this.to,
      subject,
      text:htmlToText.fromString(html),
      html
    };
    await this.newTransporter().sendMail(mailOption);
  }

  async sendWelcome(){
    await this.send("welcome","welcome to natuors family")
  }

  async sendResetPassword(){
    await this.send("resetPassword","your reset password token is valid for 10 minute")
  }
}

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

// module.exports=sendEmail;