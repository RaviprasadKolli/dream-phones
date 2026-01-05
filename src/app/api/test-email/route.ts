import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    console.log(
      "Testing Resend with API key:",
      process.env.RESEND_API_KEY?.substring(0, 10) + "..."
    );

    const { data, error } = await resend.emails.send({
      from: "Dream Phones <onboarding@resend.dev>",
      to: "raviprasadkolli123@gmail.com",
      subject: "Test Email from Dream Phones",
      html: "<h1>Hello Ravi!</h1><p>This is a test email. If you receive this, Resend is working perfectly!</p>",
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
