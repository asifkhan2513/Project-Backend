exports.passwordUpdated = (email, name) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Updated Successfully - Maazster</title>
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

    .body {
      font-size: 16px;
      color: #374151;
      margin-bottom: 25px;
    }

    .highlight {
      font-weight: bold;
      color: #0284c7;
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
      <img class="logo" src="https://yourdomain.com/assets/logo.png" alt="Maazster Logo" />
    </a>

    <div class="title">Your Password Has Been Updated</div>

    <div class="body">
      <p>Hello <strong>${name}</strong>,</p>
      <p>This is to confirm that your password has been successfully changed for the account registered with the email:</p>
      <p class="highlight">${email}</p>
      <p>If you did not request this change, please contact our support team immediately to secure your account.</p>
    </div>

    <div class="footer">
      Need help? Reach us at <a href="mailto:support@maazster.com">support@maazster.com</a><br/>
      &copy; ${new Date().getFullYear()} Maazster. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};
