import nodemailer from "nodemailer";

/**
 * Email Configuration - FREE Options:
 * 
 * 1. Gmail (Free):
 *    - SMTP_HOST=smtp.gmail.com (optional, default)
 *    - SMTP_PORT=587 (optional, default)
 *    - EMAIL_USER=your-email@gmail.com
 *    - EMAIL_PASS=your-app-password (or EMAIL_PASSWORD)
 *    - Limit: 500 emails/day
 * 
 * 2. SendGrid (Free Tier):
 *    - SMTP_HOST=smtp.sendgrid.net
 *    - SMTP_PORT=587
 *    - SMTP_USER=apikey
 *    - SMTP_PASSWORD=your-sendgrid-api-key
 *    - Limit: 100 emails/day (forever free)
 * 
 * 3. Mailgun (Free Tier):
 *    - SMTP_HOST=smtp.mailgun.org
 *    - SMTP_PORT=587
 *    - SMTP_USER=your-mailgun-username
 *    - SMTP_PASSWORD=your-mailgun-password
 *    - Limit: 5,000 emails/month (first 3 months free)
 * 
 * 4. Resend (Free Tier):
 *    - SMTP_HOST=smtp.resend.com
 *    - SMTP_PORT=587
 *    - SMTP_USER=resend
 *    - SMTP_PASSWORD=your-resend-api-key
 *    - Limit: 3,000 emails/month (free)
 * 
 * Note: nodemailer package itself is completely FREE and open source.
 * You only need a free SMTP service to send emails.
 */

// Create transporter for sending emails
// You can configure this using environment variables
function createTransporter() {
  // Use environment variables or default to a test account
  const smtpConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
    },
  };

  // If no credentials provided, return null (email won't be sent)
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.warn("Email credentials not configured. Email sending disabled.");
    return null;
  }

  try {
    return nodemailer.createTransport(smtpConfig);
  } catch (error) {
    console.error("Error creating email transporter:", error);
    return null;
  }
}

// Send email with donor information
export async function sendDonorAssignmentEmail({
  to,
  requesterName,
  patientName,
  donorInfo,
  requestInfo,
}) {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log("Email transporter not available. Skipping email send.");
      return { success: false, error: "Email not configured" };
    }

    const emailSubject = "রক্তের অনুরোধ পূরণ হয়েছে - রক্তদাতার তথ্য";
    
    // HTML email body
    const emailHtml = `
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${emailSubject}</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">রক্তের অনুরোধ পূরণ হয়েছে</h1>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
            সুপ্রিয় ${requesterName || "স্যার/ম্যাডাম"},
        </p>
        
        <p style="font-size: 15px; margin-bottom: 25px; color: #4b5563;">
            আপনার রক্তের অনুরোধ সফলভাবে পূরণ করা হয়েছে। একজন রক্তদাতা নির্ধারণ করা হয়েছে যিনি আপনার রোগীর জন্য রক্ত দিতে প্রস্তুত।
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #10b981;">
            <h2 style="color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px;">রক্তদাতার তথ্য</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 40%;">নাম:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${donorInfo.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #6b7280;">মোবাইল:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">
                        <a href="tel:${donorInfo.mobile}" style="color: #059669; text-decoration: none;">${donorInfo.mobile}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #6b7280;">ইমেইল:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">
                        <a href="mailto:${donorInfo.email}" style="color: #059669; text-decoration: none;">${donorInfo.email}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #6b7280;">রক্তের গ্রুপ:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${donorInfo.bloodGroup}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #6b7280;">অবস্থান:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${donorInfo.location}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #6b7280;">রক্তদানের সংখ্যা:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${donorInfo.totalDonations} বার</td>
                </tr>
            </table>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
            <h2 style="color: #d97706; margin-top: 0; margin-bottom: 15px; font-size: 18px;">রোগীর তথ্য</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 40%;">রোগীর নাম:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${patientName || "নির্ধারিত নয়"}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #6b7280;">রক্তের গ্রুপ:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${requestInfo.bloodGroup}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #6b7280;">প্রয়োজনীয় ইউনিট:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${requestInfo.units}</td>
                </tr>
                ${requestInfo.hospital ? `
                <tr>
                    <td style="padding: 8px 0; color: #6b7280;">হাসপাতাল:</td>
                    <td style="padding: 8px 0; font-weight: 600; color: #111827;">${requestInfo.hospital}</td>
                </tr>
                ` : ""}
            </table>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>💡 গুরুত্বপূর্ণ:</strong> অনুগ্রহ করে রক্তদাতার সাথে যোগাযোগ করুন এবং রক্তদানের বিষয়ে সমন্বয় করুন।
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                আপনার সহযোগিতার জন্য ধন্যবাদ।
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
                Blood Donation Platform
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();

    // Plain text version
    const emailText = `
সুপ্রিয় ${requesterName || "স্যার/ম্যাডাম"},

আপনার রক্তের অনুরোধ সফলভাবে পূরণ করা হয়েছে। একজন রক্তদাতা নির্ধারণ করা হয়েছে যিনি আপনার রোগীর জন্য রক্ত দিতে প্রস্তুত।

রক্তদাতার তথ্য:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
নাম: ${donorInfo.name}
মোবাইল: ${donorInfo.mobile}
ইমেইল: ${donorInfo.email}
রক্তের গ্রুপ: ${donorInfo.bloodGroup}
অবস্থান: ${donorInfo.location}
রক্তদানের সংখ্যা: ${donorInfo.totalDonations} বার
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

রোগীর তথ্য:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
রোগীর নাম: ${patientName || "নির্ধারিত নয়"}
রক্তের গ্রুপ: ${requestInfo.bloodGroup}
প্রয়োজনীয় ইউনিট: ${requestInfo.units}
${requestInfo.hospital ? `হাসপাতাল: ${requestInfo.hospital}` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

অনুগ্রহ করে রক্তদাতার সাথে যোগাযোগ করুন এবং রক্তদানের বিষয়ে সমন্বয় করুন।

আপনার সহযোগিতার জন্য ধন্যবাদ।

Blood Donation Platform
    `.trim();

    const fromEmail = process.env.SMTP_USER || process.env.EMAIL_USER || "noreply@blooddonation.com";
    
    const mailOptions = {
      from: `"Blood Donation Platform" <${fromEmail}>`,
      to: to,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

