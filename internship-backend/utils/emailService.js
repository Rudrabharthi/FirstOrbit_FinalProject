import nodemailer from 'nodemailer';

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (toEmail, resetCode) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"FirstOrbit" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Reset Your FirstOrbit Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #111827; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.4); border: 1px solid #374151; }
          .header { background: #111827; padding: 30px; text-align: center; border-bottom: 1px solid #374151; }
          .header h1 { color: #a5b4fc; margin: 0; font-size: 28px; }
          .header p { color: #9ca3af; margin: 10px 0 0 0; }
          .content { padding: 30px; background: #1f2937; }
          .content p { color: #d1d5db; }
          .code-box { background: linear-gradient(135deg, #171756ff, #111827); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4); }
          .info { color: #9ca3af; font-size: 14px; text-align: center; margin-top: 20px; }
          .footer { background: #111827; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #374151; }
          .warning { color: #f87171; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 FirstOrbit</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Use the code below to complete the reset:</p>
            
            <div class="code-box">${resetCode}</div>
            
            <p class="info">This code will expire in <span class="warning">15 minutes</span>.</p>
            <p class="info">If you didn't request this, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2026 FirstOrbit - Your First Career Trajectory</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendPasswordResetEmail };
