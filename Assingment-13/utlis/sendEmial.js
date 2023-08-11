import nodemailer from "nodemailer"

const sendMail = async (email,email_url) =>
{
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maynksaini4455@gmail.com", // generated ethereal user
      pass: "hnrorkebkcunchtj" // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Mayank saini" <maynksaini4455@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Verify Gmail ✔", // Subject line
    text: email_url, // plain text body
  },(err)=>
  {
    if(err)
        console.log(err)
  });
}

export default sendMail;