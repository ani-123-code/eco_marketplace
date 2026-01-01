const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Get OAuth2 access token
const getAccessToken = async () => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    const accessToken = await oauth2Client.getAccessToken();
    return accessToken;
  } catch (error) {
    console.error('Error getting OAuth2 access token:', error);
    throw error;
  }
};

// Create reusable transporter with Gmail OAuth2
const createTransporter = async () => {
  // Check if using Gmail OAuth2 (from .env lines 24-30)
  const gmailClientId = process.env.GMAIL_CLIENT_ID;
  const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET;
  const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
  
  // Use Gmail OAuth2 if credentials are available
  if (gmailClientId && gmailClientSecret && gmailRefreshToken && gmailUser) {
    try {
      const accessToken = await getAccessToken();
      
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: gmailUser,
          clientId: gmailClientId,
          clientSecret: gmailClientSecret,
          refreshToken: gmailRefreshToken,
          accessToken: accessToken
        }
      });
    } catch (error) {
      console.error('Error creating OAuth2 transporter:', error);
      throw error;
    }
  }
  
  // Fallback to basic auth if OAuth2 not configured
  const emailService = process.env.EMAIL_SERVICE;
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT || 465;
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;
  const emailSecure = process.env.EMAIL_SECURE !== 'false';
  
  // If using a service like Gmail with basic auth
  if (emailService && !emailHost) {
    return nodemailer.createTransport({
      service: emailService,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });
  }
  
  // If using SMTP with custom host
  if (emailHost) {
    return nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort),
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPassword
      },
      tls: {
        rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false'
      }
    });
  }
  
  // Default fallback
  throw new Error('Email configuration not found. Please set Gmail OAuth2 credentials or EMAIL_HOST/EMAIL_SERVICE in .env file');
};

// Email templates
const emailTemplates = {
  quoteRequest: (data) => {
    const { buyerName, companyName, materialName, materialCode, requestedQuantity, unit, buyerEmail, buyerMobile, countryCode, specifications } = data;
    
    return {
      subject: `Quote Request Received - ${materialCode} | Eco Marketplace`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #4b5563; }
            .value { color: #111827; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Quote Request Received</h1>
              <p>Eco Marketplace</p>
            </div>
            <div class="content">
              <p>Dear ${buyerName},</p>
              
              <p>Thank you for your interest in our Post-Consumer Recycled materials. We have received your quote request and our team will review it shortly.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #16a34a;">Request Details</h3>
                <div class="info-row">
                  <span class="label">Request ID:</span>
                  <span class="value">${data.requestId || 'Processing...'}</span>
                </div>
                <div class="info-row">
                  <span class="label">Material:</span>
                  <span class="value">${materialName} (${materialCode})</span>
                </div>
                <div class="info-row">
                  <span class="label">Quantity Requested:</span>
                  <span class="value">${requestedQuantity} ${unit}</span>
                </div>
                <div class="info-row">
                  <span class="label">Company:</span>
                  <span class="value">${companyName}</span>
                </div>
                ${buyerEmail ? `<div class="info-row"><span class="label">Email:</span><span class="value">${buyerEmail}</span></div>` : ''}
                ${buyerMobile ? `<div class="info-row"><span class="label">Mobile:</span><span class="value">${countryCode} ${buyerMobile}</span></div>` : ''}
                ${specifications ? `<div class="info-row"><span class="label">Additional Specifications:</span><span class="value">${specifications}</span></div>` : ''}
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our sourcing specialists will review your request within 24 hours</li>
                <li>We'll verify material availability and prepare a detailed quote</li>
                <li>You'll receive pricing, delivery terms, and quality documentation</li>
                <li>Our team will coordinate samples if needed</li>
              </ul>
              
              <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:sales@ecodispose.com">sales@ecodispose.com</a> or call us at +91 88610 09443.</p>
              
              <p>Best regards,<br>
              <strong>Eco Marketplace Team</strong><br>
              Powered by EcoDispose</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply directly to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Eco Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Quote Request Received - Eco Marketplace
        
        Dear ${buyerName},
        
        Thank you for your interest in our Post-Consumer Recycled materials. We have received your quote request.
        
        Request Details:
        - Material: ${materialName} (${materialCode})
        - Quantity: ${requestedQuantity} ${unit}
        - Company: ${companyName}
        ${buyerEmail ? `- Email: ${buyerEmail}` : ''}
        ${buyerMobile ? `- Mobile: ${countryCode} ${buyerMobile}` : ''}
        ${specifications ? `- Specifications: ${specifications}` : ''}
        
        Our team will review your request within 24 hours and send you a detailed quote.
        
        For questions, contact us at sales@ecodispose.com or +91 88610 09443.
        
        Best regards,
        Eco Marketplace Team
        Powered by EcoDispose
      `
    };
  },

  sellerRequest: (data) => {
    const { name, company_name, email, mobile } = data;
    
    return {
      subject: `Seller Registration Request Received | Eco Marketplace`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #4b5563; }
            .value { color: #111827; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Seller Registration Request</h1>
              <p>Eco Marketplace</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              
              <p>Thank you for your interest in becoming a supplier on Eco Marketplace. We have received your seller registration request and our team will review it shortly.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #16a34a;">Your Application Details</h3>
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span class="value">${name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Company:</span>
                  <span class="value">${company_name}</span>
                </div>
                ${email ? `<div class="info-row"><span class="label">Email:</span><span class="value">${email}</span></div>` : ''}
                ${mobile ? `<div class="info-row"><span class="label">Mobile:</span><span class="value">${mobile}</span></div>` : ''}
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team reviews your application within 24-48 hours</li>
                <li>We'll contact you to discuss your materials and capabilities</li>
                <li>After verification, you'll be onboarded to our supplier network</li>
                <li>You can start listing your Post-Consumer Recycled materials</li>
              </ul>
              
              <p>As a verified supplier on Eco Marketplace, you'll benefit from:</p>
              <ul>
                <li>Access to a network of industrial buyers seeking PCR materials</li>
                <li>Professional listing and marketing support</li>
                <li>Secure transaction processing</li>
                <li>Dedicated account management</li>
              </ul>
              
              <p>If you have any questions, please contact us at <a href="mailto:sales@ecodispose.com">sales@ecodispose.com</a> or call us at +91 88610 09443.</p>
              
              <p>Best regards,<br>
              <strong>Eco Marketplace Team</strong><br>
              Powered by EcoDispose</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply directly to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Eco Marketplace. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Seller Registration Request - Eco Marketplace
        
        Dear ${name},
        
        Thank you for your interest in becoming a supplier on Eco Marketplace.
        
        Application Details:
        - Name: ${name}
        - Company: ${company_name}
        ${email ? `- Email: ${email}` : ''}
        ${mobile ? `- Mobile: ${mobile}` : ''}
        
        Our team will review your application within 24-48 hours and contact you to discuss partnership opportunities.
        
        For questions, contact us at sales@ecodispose.com or +91 88610 09443.
        
        Best regards,
        Eco Marketplace Team
        Powered by EcoDispose
      `
    };
  }
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  try {
    // Check if Gmail OAuth2 is configured (from .env lines 24-30)
    const gmailClientId = process.env.GMAIL_CLIENT_ID;
    const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET;
    const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
    
    // Check if basic auth is configured (fallback)
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;
    const emailHost = process.env.EMAIL_HOST;
    const emailService = process.env.EMAIL_SERVICE;
    
    // Validate OAuth2 configuration
    if (gmailClientId && gmailClientSecret && gmailRefreshToken) {
      if (!gmailUser) {
        console.warn('Gmail OAuth2 configured but GMAIL_USER not set.');
        return { success: false, message: 'GMAIL_USER required for OAuth2' };
      }
    } else if (!emailUser || (!emailPassword && !emailHost && !emailService)) {
      console.warn('Email service not configured. Please set Gmail OAuth2 credentials or basic auth.');
      return { success: false, message: 'Email service not configured' };
    }

    // Create transporter (will use OAuth2 if available, otherwise fallback to basic auth)
    const transporter = await createTransporter();
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Email template "${templateName}" not found`);
    }

    const emailContent = template(data);
    
    // Get sender name and email from env
    const senderName = process.env.EMAIL_SENDER_NAME || 'Eco Marketplace';
    const senderEmail = gmailUser || emailUser;
    
    if (!senderEmail) {
      throw new Error('Sender email not configured');
    }
    
    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via Gmail OAuth2:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};

