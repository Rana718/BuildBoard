import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

export const sendSellerSelectionEmail = async (
  sellerEmail: string,
  sellerName: string,
  projectTitle: string,
  buyerName: string
) => {
  const subject = `🎉 You've been selected for project: ${projectTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Congratulations! You've been selected!</h2>
      <p>Hi ${sellerName},</p>
      <p>Great news! You have been selected to work on the project <strong>"${projectTitle}"</strong> by ${buyerName}.</p>
      <p>The project status has been updated to "In Progress". Please log in to your dashboard to view the project details and start working.</p>
      <p>Best of luck with your project!</p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated email from the Project Bidding System.</p>
    </div>
  `;

  return sendEmail(sellerEmail, subject, html);
};

export const sendProjectCompletionEmail = async (
  buyerEmail: string,
  buyerName: string,
  projectTitle: string,
  sellerName: string
) => {
  const subject = `✅ Project Completed: ${projectTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Project Completed Successfully!</h2>
      <p>Hi ${buyerName},</p>
      <p>Your project <strong>"${projectTitle}"</strong> has been marked as completed by ${sellerName}.</p>
      <p>Please log in to your dashboard to:</p>
      <ul>
        <li>Review the deliverables</li>
        <li>Leave a review for the seller</li>
        <li>Download any project files</li>
      </ul>
      <p>Thank you for using our platform!</p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated email from the Project Bidding System.</p>
    </div>
  `;

  return sendEmail(buyerEmail, subject, html);
};

export const sendWelcomeEmail = async (
  userEmail: string,
  userName: string
) => {
  const subject = `🎉 Welcome to BuildBoard - Your Project Bidding Platform!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to BuildBoard!</h2>
      <p>Hi ${userName},</p>
      <p>Welcome to BuildBoard, your go-to platform for project bidding and collaboration!</p>
      <p>Here's what you can do on our platform:</p>
      <ul>
        <li><strong>Post Projects:</strong> Share your project ideas and receive bids</li>
        <li><strong>Browse Projects:</strong> Find interesting projects to work on</li>
        <li><strong>Submit Bids:</strong> Compete for projects with your best offers</li>
        <li><strong>Build Reputation:</strong> Complete projects and earn reviews</li>
      </ul>
      <p>Ready to get started? <a href="${process.env.FRONTEND_URL}/dashboard" style="color: #2563eb;">Visit your dashboard</a></p>
      <p>Best regards,<br>The BuildBoard Team</p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated email from BuildBoard.</p>
    </div>
  `;

  return sendEmail(userEmail, subject, html);
};

export const sendBidNotificationEmail = async (
  buyerEmail: string,
  bidderName: string,
  projectTitle: string,
  bidAmount: number
) => {
  const subject = `💰 New Bid Received for: ${projectTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Bid Received!</h2>
      <p>Great news! You've received a new bid for your project.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p><strong>Project:</strong> ${projectTitle}</p>
        <p><strong>Bidder:</strong> ${bidderName}</p>
        <p><strong>Bid Amount:</strong> $${bidAmount.toLocaleString()}</p>
      </div>
      <p>Log in to your dashboard to view the full bid details and consider this proposal.</p>
      <p><a href="${process.env.FRONTEND_URL}/dashboard/projects" style="color: #2563eb; text-decoration: none; background-color: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">View Bid Details</a></p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated email from BuildBoard.</p>
    </div>
  `;

  return sendEmail(buyerEmail, subject, html);
};

export const sendProjectCompletedNotificationEmail = async (
  buyerEmail: string,
  sellerEmail: string,
  projectTitle: string,
  buyerName: string,
  sellerName: string
) => {
  // Send to buyer
  const buyerSubject = `✅ Project Completed: ${projectTitle}`;
  const buyerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Project Completed Successfully!</h2>
      <p>Hi ${buyerName},</p>
      <p>Your project <strong>"${projectTitle}"</strong> has been marked as completed by ${sellerName}.</p>
      <p>Please log in to your dashboard to:</p>
      <ul>
        <li>Review the deliverables</li>
        <li>Leave a review for the seller</li>
        <li>Download any project files</li>
      </ul>
      <p><a href="${process.env.FRONTEND_URL}/dashboard/projects" style="color: #16a34a; text-decoration: none;">Review Project →</a></p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated email from BuildBoard.</p>
    </div>
  `;

  // Send to seller
  const sellerSubject = `🎉 Project Completed: ${projectTitle}`;
  const sellerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Great Job on Completing the Project!</h2>
      <p>Hi ${sellerName},</p>
      <p>Congratulations! You've successfully completed the project <strong>"${projectTitle}"</strong> for ${buyerName}.</p>
      <p>The buyer has been notified and will review your work. You should receive feedback and a review soon.</p>
      <p>Keep up the excellent work and look forward to more projects!</p>
      <p><a href="${process.env.FRONTEND_URL}/dashboard" style="color: #16a34a; text-decoration: none;">View Dashboard →</a></p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated email from BuildBoard.</p>
    </div>
  `;

  // Send both emails
  await Promise.all([
    sendEmail(buyerEmail, buyerSubject, buyerHtml),
    sendEmail(sellerEmail, sellerSubject, sellerHtml)
  ]);
};
