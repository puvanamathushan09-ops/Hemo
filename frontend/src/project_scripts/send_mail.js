// import { Email } from "./smtp.js";

// async function sendemail_request_donors(email) {
//   console.log("sending");
//   Email.send({
//     Host: "smtp.elasticemail.com",
//     Username: "bldbank146@gmail.com",
//     Password: "3AECAE4665C09B6618D42B3EB5965F8093DD",
//     To: email,
//     From: "bldbank146@gmail.com",
//     Subject: "Need of blood",
//       Body: "<html> <p style=\"font-size:14px\">There is a need of blood with your blood group.If you want to donate blood,please visit our website on:<a href=\"https:\/\/lsbbbloodbank.me\/Donate.html\" >LifeSavingBloodBank</a></p></strong><br>This is an auto-generated E-mail. Hence, do no reply.<br><h2> Best Regards,<br>GITAM BLOODBANK TEAM</h2></html>",
//   //   Attachments: [
//   //     {
//   //       name: "File_Name_with_Extension",
//   //       path: "Full Path of the file"
// //   }]
//   })
//     .then(function (message) {
//       // alert("Mail has been sent successfully");
//       return true;
//     });
// }


// async function sendemail_donation(email) {
//     console.log("sending");
//     Email.send({
//       Host: "smtp.elasticemail.com",
//       Username: "bldbank146@gmail.com",
//       Password: "3AECAE4665C09B6618D42B3EB5965F8093DD",
//       To: email,
//       From: "bldbank146@gmail.com",
//       Subject: "Thank you for donating blood",
// /*needs change*/      Body: "<html> <p style=\"font-size:14px\"><h2>Thank You!</h2><br><p style=\"font-size:14px\">Your Contribution helps us save lives.Thank you for your genoristy,support and commitment for patients in need.</p></strong><br>This is an auto-generated E-mail. Hence, do no reply.<br><h2> Best Regards,<br>GITAM BLOODBANK TEAM</h2></html>",
//     //   Attachments: [
//     //     {
//     //       name: "File_Name_with_Extension",
//     //       path: "Full Path of the file"
//     //     }]
//     })
//       .then(function (message) {
//         // alert("Mail has been sent successfully");
//         return true;
//       });
//   }
// async function sendemail_request(email) {
//     console.log("sending");
//     Email.send({
//       Host: "smtp.elasticemail.com",
//       Username: "bldbank146@gmail.com",
//       Password: "3AECAE4665C09B6618D42B3EB5965F8093DD",
//       To: email,
//       From: "bldbank146@gmail.com",
//       Subject: "Requested Blood",
// /*needs change*/      Body: "<html> <p style=\"font-size:14px\">Thank You!<br><p style=\"font-size:14px\">We have recorded your request for blood of the specified blood group.We will try our best to respond in positive terms.Thank you for choosing our website.We appreciate your trust and we will do our best.</p><br><strong></p></strong><br>This is an auto-generated E-mail. Hence, do no reply.<br><h2> Best Regards,<br>GITAM BLOODBANK TEAM</h2></html>",
//     //   Attachments: [
//     //     {
//     //       name: "File_Name_with_Extension",
//     //       path: "Full Path of the file"
//     //     }]
//     })
//       .then(function (message) {
//         // alert("Mail has been sent successfully");
//         return true;
//       });
//   }

// export {sendemail_donation, sendemail_request, sendemail_request_donors};