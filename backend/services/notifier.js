const { sendMail } = require("./mailer");
const Newsletter = require("../models/Newsletter");

async function notifySubscribers({ type, title, excerpt, url }) {
  const subs = await Newsletter.find({ active: true }).select("email");
  if (!subs.length) {
    console.log(`[NOTIFY] Aucun abonné actif pour notifier`);
    return;
  }

  const siteUrl = process.env.CLIENT_URL || "https://portfolio.cm";
  const siteName = process.env.SITE_NAME || "Portfolio";

  const isProject = type === "project";
  const emoji = isProject ? "🚀" : "📝";
  const actionLabel = isProject ? "Nouveau projet" : "Nouvel article";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#010214;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#010214">
    <tr><td align="center" style="padding:40px 20px">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0a0a1a;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
        <tr><td style="padding:40px 32px 32px">
          <div style="text-align:center;margin-bottom:32px">
            <span style="font-size:40px">${emoji}</span>
            <h1 style="color:#ffffff;font-size:24px;margin:12px 0 4px;letter-spacing:-0.5px">${actionLabel}</h1>
            <p style="color:rgba(255,255,255,0.4);font-size:14px;margin:0">${siteName}</p>
          </div>

          <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:28px;margin-bottom:28px;border:1px solid rgba(255,255,255,0.06)">
            <h2 style="color:#00b4d8;font-size:20px;margin:0 0 12px">${title}</h2>
            <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 20px">${excerpt || ""}</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:10px;background:#00b4d8;padding:0">
                  <a href="${url.startsWith("http") ? url : siteUrl + url}" target="_blank"
                     style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px">
                    Voir ${isProject ? "le projet" : "l'article"} →
                  </a>
                </td>
              </tr>
            </table>
          </div>

          <div style="text-align:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)">
            <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0">
              Vous recevez cet email car vous êtes abonné à la newsletter de ${siteName}.
              <br>Si vous souhaitez vous désabonner, <a href="${siteUrl}/newsletter/unsubscribe" style="color:rgba(255,255,255,0.4)">cliquez ici</a>.
            </p>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  let sent = 0;
  for (const sub of subs) {
    const ok = await sendMail({
      to: sub.email,
      subject: `${emoji} ${actionLabel} — ${title}`,
      html,
    });
    if (ok) sent++;
  }

  console.log(`[NOTIFY] ${sent}/${subs.length} emails envoyés pour "${title}"`);
}

module.exports = { notifySubscribers };
