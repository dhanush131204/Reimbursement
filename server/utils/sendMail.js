import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment variables');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

/**
 * Send an email through Gmail via Nodemailer.
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML body content
 * @param {string} [params.text] - Plain text fallback body
 */
export const sendMail = async ({ to, subject, html, text }) => {
  if (!to) {
    throw new Error('Recipient email address is required to send a notification');
  }

  try {
    const transporter = createTransporter();

    console.log(`[sendMail] Attempting to send email to: ${to}`);

    const info = await transporter.sendMail({
      from: `"Reimbursement" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || 'View this message in an HTML-capable email client.',
    });

    console.log(`[sendMail] Email sent successfully → to: ${to} | messageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('[sendMail] Detailed Nodemailer Error:', error);
    // Log helpful hints for Gmail app passwords
    if (error.code === 'EAUTH') {
      console.error('[sendMail] Authentication failed. Please check GMAIL_USER and GMAIL_APP_PASSWORD.');
    }
    throw error;
  }
};

/**
 * Build the HTML email for an approved reimbursement.
 */
export const approvalEmailHtml = ({ employeeName, reimbursementTitle, claimStatus }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reimbursement Approved</title>
  <style>
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f4f7fb; color: #1f2937; }
    .container { width: 100%; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); overflow: hidden; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; letter-spacing: -0.03em; }
    .body { padding: 28px; line-height: 1.7; }
    .badge { display: inline-block; padding: 8px 16px; background: #d1fae5; color: #047857; border-radius: 999px; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }
    .section { margin-top: 24px; }
    .section h2 { margin-bottom: 12px; font-size: 18px; color: #111827; }
    .section p { margin: 6px 0; }
    .footer { padding: 24px 28px 32px; background: #f8fafc; color: #475569; font-size: 14px; }
    .footer p { margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>Your reimbursement has been approved</h1>
      </div>
      <div class="body">
        <span class="badge">${claimStatus}</span>
        <div class="section">
          <h2>Hello ${employeeName},</h2>
          <p>We are pleased to inform you that your reimbursement request has been <strong>approved</strong>.</p>
        </div>
        <div class="section">
          <h2>Reimbursement details</h2>
          <p><strong>Employee name:</strong> ${employeeName}</p>
          <p><strong>Title:</strong> ${reimbursementTitle}</p>
          <p><strong>Status:</strong> Approved</p>
        </div>
        <div class="section">
          <p>If you have any follow-up questions, please contact your finance or HR team.</p>
          <p>Thank you for submitting your expense.</p>
        </div>
      </div>
      <div class="footer">
        <p>Reimbursement Team</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

/**
 * Build the HTML email for a rejected reimbursement.
 */
export const rejectionEmailHtml = ({ employeeName, reimbursementTitle, claimStatus, rejectionNote }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reimbursement Rejected</title>
  <style>
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f7f8fb; color: #1f2937; }
    .container { width: 100%; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); overflow: hidden; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; letter-spacing: -0.03em; }
    .body { padding: 28px; line-height: 1.7; }
    .badge { display: inline-block; padding: 8px 16px; background: #fee2e2; color: #b91c1c; border-radius: 999px; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }
    .section { margin-top: 24px; }
    .section h2 { margin-bottom: 12px; font-size: 18px; color: #111827; }
    .section p { margin: 6px 0; }
    .note-box { margin-top: 16px; padding: 18px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; color: #991b1b; }
    .footer { padding: 24px 28px 32px; background: #f8fafc; color: #475569; font-size: 14px; }
    .footer p { margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>Your reimbursement has been rejected</h1>
      </div>
      <div class="body">
        <span class="badge">${claimStatus}</span>
        <div class="section">
          <h2>Hello ${employeeName},</h2>
          <p>Your reimbursement request was reviewed, and the status has been updated to <strong>rejected</strong>.</p>
        </div>
        <div class="section">
          <h2>Reimbursement details</h2>
          <p><strong>Employee name:</strong> ${employeeName}</p>
          <p><strong>Title:</strong> ${reimbursementTitle}</p>
          <p><strong>Status:</strong> Rejected</p>
        </div>
        <div class="section note-box">
          <h2>Rejection note</h2>
          <p>${rejectionNote || 'No reason provided.'}</p>
        </div>
        <div class="section">
          <p>Please review the note and resubmit the reimbursement with any required corrections.</p>
        </div>
      </div>
      <div class="footer">
        <p>Reimbursement Team</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

/**
 * Build the HTML email for a newly created user.
 */
export const newUserEmailHtml = ({ userName, userEmail, plainPassword }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Account Has Been Created</title>
  <style>
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f7f8fb; color: #1f2937; }
    .container { width: 100%; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); overflow: hidden; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; letter-spacing: -0.03em; }
    .body { padding: 28px; line-height: 1.7; }
    .section { margin-top: 24px; }
    .section h2 { margin-bottom: 12px; font-size: 18px; color: #111827; }
    .section p { margin: 6px 0; }
    .credentials { margin-top: 16px; padding: 18px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937; }
    .footer { padding: 24px 28px 32px; background: #f8fafc; color: #475569; font-size: 14px; }
    .footer p { margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>Welcome to Reimbursement App!</h1>
      </div>
      <div class="body">
        <div class="section">
          <h2>Hello ${userName},</h2>
          <p>An administrator has created an account for you in the Reimbursement system.</p>
        </div>
        <div class="section credentials">
          <h2>Your Login Credentials</h2>
          <p><strong>Email (Gmail):</strong> ${userEmail}</p>
          <p><strong>Password:</strong> ${plainPassword}</p>
        </div>
        <div class="section">
          <p>Please log in using these credentials. We recommend changing your password after your first login if applicable.</p>
        </div>
      </div>
      <div class="footer">
        <p>Reimbursement Team</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
