const nodemailer = require("nodemailer");
const sendEmailVerificationCode = (
  email,
  otp = null,
  next = null,
  psw = false
) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mailto:jeevantest64@gmail.com",
      pass: "aora lfje anli ajnp",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "Farmerson <mailto:jeevantest64@gmail.com>",
    to: email,
    subject: otp
      ? psw
        ? "Password Reset OTP - Farmerson"
        : "Verify Your Email - Farmerson"
      : "Important Notification - Farmerson",
    html: otp
      ? psw
        ? `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center;">
          <h2 style="color: #4CAF50;">Hello from <span style="color: #ff9800;">Farmerson</span>!</h2>
          <p style="font-size: 16px; color: #333;">Your one-time password reset code is:</p>
          <p style="font-size: 22px; font-weight: bold; color: #4CAF50; background: #f2f2f2; padding: 10px; display: inline-block; border-radius: 5px;">
            ${otp}
          </p>
          <p style="font-size: 14px; color: #777;">Use this code to reset your password. It is valid for a limited time.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; color: #555;">Need help? Contact our support team at <a href="mailto:support@farmerson.com" style="color: #ff9800; text-decoration: mailto:none;">support@farmerson.com</a>.</p>
          <p style="font-size: 12px; color: #999;">If you did not request this reset, please ignore this email.</p>
          <p style="font-size: 14px; color: #555;"><strong>Farmerson Team</strong></p>
          <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} Farmerson. All rights reserved.</p>
        </div>
        `
        : `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center;">
          <h2 style="color: #4CAF50;">Welcome to <span style="color: #ff9800;">Farmerson</span>!</h2>
          <p style="font-size: 16px; color: #333;">Your one-time verification code is:</p>
          <p style="font-size: 22px; font-weight: bold; color: #4CAF50; background: #f2f2f2; padding: 10px; display: inline-block; border-radius: 5px;">
            ${otp}
          </p>
          <p style="font-size: 14px; color: #777;">Use this code to complete your email verification. It is valid for a limited time.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; color: #555;">Need help? Contact our support team at <a href="mailto:support@farmerson.com" style="color: #ff9800; text-decoration: mailto:none;">support@farmerson.com</a>.</p>
          <p style="font-size: 12px; color: #999;">If you did not request this verification, please ignore this email.</p>
          <p style="font-size: 14px; color: #555;"><strong>Farmerson Team</strong></p>
          <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} Farmerson. All rights reserved.</p>
        </div>
        `
      : `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center;">
        <h2 style="color: #4CAF50;">Hello from <span style="color: #ff9800;">Farmerson</span>!</h2>
        <p style="font-size: 16px; color: #333;">This is an important notification from Farmerson.</p>
        <p style="font-size: 14px; color: #555;">Need help? Contact our support team at <a href="mailto:support@farmerson.com" style="color: #ff9800; text-decoration: mailto:none;">support@farmerson.com</a>.</p>
        <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} Farmerson. All rights reserved.</p>
      </div>
      `,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("Email not sent:", err);
      return {
        error: 502,
        message: "Email not sent",
      };
    } else {
      console.log("Email sent successfully");
      if (next) next();
    }
  });
};

module.exports = sendEmailVerificationCode;
