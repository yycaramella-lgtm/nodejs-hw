export const sendEmail = async ({ to, subject, html }) => {
  const response = await fetch(
    'https://api.brevo.com/v3/smtp/email',
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'nodejs-hw',
          email: process.env.SMTP_FROM,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${error}`);
  }

  return response.json();
};