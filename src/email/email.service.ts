import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { User } from 'src/user/entities/user.entity';

dotenv.config();

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.USERNAME,
        pass: process.env.APP_PASSWORD,
      },
    });
  }

  async sendVerifyEmail(email: string, otp: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'nnamdidanielosuji@gmail.com',
      to: email,
      subject: 'Verify Your email address',
      text: 'One time passsword',
      html: `<html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to Our Platform</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 80%;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            text-align: center;
          }
          h1 {
            color: #007bff;
            margin-bottom: 20px;
          }
          p {
            color: #555;
            margin-bottom: 10px;
          }
          .verification-code {
            color: #007bff;
            padding: 10px 15px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 2.5rem;
            margin: 20px 0;
          }
          .contact-info {
            margin-top: 20px;
          }
          .team-signature {
            margin-top: 20px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Verify Your Email Address</h1>
          <p>Hello There</p>
          <p>Thank you for joining us. Your verification code is:</p>
          <div class="verification-code">${otp}</div>
          <p>Please use this code to complete your registration.</p>
          <p>If you have any questions or need assistance, feel free to contact us. We're here to help!</p>
          <p class="contact-info">Best regards,<br>The Team</p>
          <p class="team-signature">Contact us at support@ourplatform.com</p>
        </div>
      </body>
      </html> `,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeMail(user: User) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'nnamdidanielosuji@gmail.com',
      to: user.email,
      subject: 'Welcome to E-Biding',
      text: 'Your account has been successfully verified. Welcome to our platform!',
      html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to NIGALEX E-Bidding</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #007bff;
              font-size: 24px;
            }
            p {
              line-height: 1.6;
              color: #555;
            }
            ul {
              list-style-type: disc;
              margin-left: 20px;
            }
            .cta {
              text-align: center;
              margin-top: 20px;
            }
            .btn {
              background-color: #007bff;
              color: #fff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
            }
            .btn:hover {
              background-color: #0056b3;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to NIGALEX E-Bidding, {{user.firstName}}!</h1>
            <p>
              We’re thrilled to have you on board! Your account has been successfully
              verified, and you are now part of the NIGALEX E-Bidding community.
            </p>
            <p>
              Here’s what you can expect from our platform:
            </p>
            <ul>
              <li><strong>Real-Time Auction Services:</strong> Bid on items seamlessly and stay ahead in the game.</li>
              <li><strong>Reliable Product Delivery:</strong> Get your auctioned items delivered swiftly and securely.</li>
              <li><strong>Comprehensive Auction Management:</strong> Track your bids and auctions with ease.</li>
            </ul>
            <p>
              Explore the powerful features we offer and let us help you elevate your
              bidding experience.
            </p>
            <div class="cta">
              <a href="https://example.com/login" class="btn">Start Exploring</a>
            </div>
            <p>
              If you have any questions or need assistance, our team is here to help.
              Contact us anytime at <a href="mailto:support@example.com">support@example.com</a>.
            </p>
            <p>
              Welcome aboard, and we can’t wait to see your success stories with us!
            </p>
            <p>
              Best regards,<br>
              The NIGALEX E-Bidding Team
            </p>
            <div class="footer">
              &copy; 2025 NIGALEX E-Bidding. All rights reserved.
            </div>
          </div>
        </body>
      </html>
      
        `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  //   async sendResetPasswordTokenMail(user: User, code: string) {
  //     const mailOptions: nodemailer.SendMailOptions = {
  //       from: 'nnamdidanielosuji@gmail.com',
  //       to: user.email_address,
  //       subject: 'FORGOT PASSWORD',
  //       text: 'One time passsword',
  //       html: `<html lang="en">
  //       <head>
  //         <meta charset="UTF-8">
  //         <title>Welcome to Our Platform</title>
  //         <style>
  //           body {
  //             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  //             background-color: #f5f5f5;
  //             margin: 0;
  //             padding: 0;
  //           }
  //           .container {
  //             width: 80%;
  //             margin: 20px auto;
  //             padding: 20px;
  //             background-color: #ffffff;
  //             box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  //             border-radius: 8px;
  //             text-align: center;
  //           }
  //           h1 {
  //             color: #007bff;
  //             margin-bottom: 20px;
  //           }
  //           p {
  //             color: #555;
  //             margin-bottom: 10px;
  //           }
  //           .verification-code {
  //             color: #007bff;
  //             padding: 10px 15px;
  //             border-radius: 4px;
  //             font-weight: bold;
  //             font-size: 2.5rem;
  //             margin: 20px 0;
  //           }
  //           .contact-info {
  //             margin-top: 20px;
  //           }
  //           .team-signature {
  //             margin-top: 20px;
  //             color: #888;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">
  //           <h1>Password reset token</h1>
  //           <p>Hello ${user.first_name} ${user.last_name}</p>
  //           <p>You requested a password reset on your Abacus account.</p>
  //           <div class="verification-code">${code}</div>
  //           <p>Please use the code below to set a new password on your account</p>
  //           <p>If you did not initiate this request, please ignore this email and contact our Support Team immediately.</p>
  //           <p class="contact-info">Best regards,<br>The Team</p>
  //           <p class="team-signature">Contact us at support@ourplatform.com</p>
  //         </div>
  //       </body>
  //       </html> `,
  //     };
  //     try {
  //       const info = await this.transporter.sendMail(mailOptions);
  //       console.log('Message sent: %s', info.messageId);
  //     } catch (error) {
  //       console.error('Error sending email:', error);
  //       throw new Error('Failed to send email');
  //     }
  //   }
}
