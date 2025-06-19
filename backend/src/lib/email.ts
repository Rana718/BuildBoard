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
