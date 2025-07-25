const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Maazster OTP Verification</title>
  <style>
    body {
      background-color: #f4f4f4;
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      text-align: center;
    }

    .logo {
      max-width: 180px;
      margin-bottom: 20px;
    }

    .title {
      font-size: 22px;
      color: #1f2937;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .message {
      font-size: 16px;
      color: #374151;
      margin-bottom: 25px;
    }

    .otp-code {
      font-size: 32px;
      font-weight: bold;
      background-color: #e0f2fe;
      color: #0284c7;
      padding: 12px 24px;
      display: inline-block;
      border-radius: 8px;
      letter-spacing: 4px;
      margin: 10px 0;
    }

    .note {
      font-size: 14px;
      color: #6b7280;
      margin-top: 20px;
    }

    .footer {
      font-size: 13px;
      color: #9ca3af;
      margin-top: 30px;
    }

    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="container">
    <a href="https://maazster.com">
      <img class="logo" src="https://yourdomain.com/assets/logo.png" alt="Maazster Logo"/>
    </a>

    <div class="title">Email Verification - Maazster</div>

    <div class="message">
      Hi there!<br/><br/>
      Thank you for signing up with <strong>Maazster</strong>. Please use the OTP below to verify your email address:
    </div>

    <div class="otp-code">${otp}</div>

    <div class="note">
      This OTP is valid for the next <strong>5 minutes</strong>.<br/>
      If you didn’t request this, you can safely ignore this email.
    </div>

    <div class="footer">
      Need help? Reach out at <a href="mailto:support@maazster.com">support@maazster.com</a><br/>
      &copy; ${new Date().getFullYear()} Maazster. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};

module.exports = otpTemplate;
