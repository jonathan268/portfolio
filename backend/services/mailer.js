const nodemailer = require("nodemailer");

let transporter = null;

function getTransport() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("⚠️  SMTP non configuré — les emails ne seront pas envoyés. Définissez SMTP_HOST, SMTP_USER, SMTP_PASS dans .env");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT) || 587,
    secure: (parseInt(SMTP_PORT) || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

async function sendMail({ to, subject, html }) {
  const transport = getTransport();
  if (!transport) {
    console.log(`[EMAIL SKIPPED] To: ${to} | Subject: ${subject}`);
    return false;
  }

  try {
    await transport.sendMail({
      from: `"${process.env.SITE_NAME || "Portfolio"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("Erreur envoi email:", err.message);
    return false;
  }
}

module.exports = { sendMail };
