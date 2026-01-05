import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(user: { email: string; name: string }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to Dream Phones! 👋</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hi ${user.name},</p>
          <p>Thank you for joining Dream Phones!</p>
          <p>Start shopping for the latest smartphones and accessories.</p>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "Dream Phones <onboarding@resend.dev>",
      to: user.email,
      subject: "Welcome to Dream Phones!",
      html,
    });
  } catch (error) {
    console.error("Email error:", error);
  }
}
