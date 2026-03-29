/**
 * SMS pour codes OTP (validation téléphone). En production : Twilio si les variables sont définies.
 * Sinon : log serveur (dev uniquement).
 */

export async function sendSmsOtp(toPhone: string, code: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const body = `Votre code JeChemine : ${code} (valide 10 min). Ne le partagez pas.`;

  if (sid && token && from) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const params = new URLSearchParams({
      To: toPhone,
      From: from,
      Body: body,
    });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Twilio SMS failed: ${res.status} ${t}`);
    }
    return;
  }

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[sms] TWILIO_* non configuré — impossible d’envoyer le SMS en production.",
    );
    throw new Error("SMS provider not configured");
  }

  console.info(
    `[sms] (dev) OTP pour ${toPhone} : ${code} — configurez TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER pour l’envoi réel.`,
  );
}
