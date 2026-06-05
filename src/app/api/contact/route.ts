import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot spam protection trigger
    // If the hidden 'website' field is populated, we classify it as bot spam.
    // We return a mock HTTP 200 success code to prevent the spam bot from retrying or alerts.
    if (website && website.trim() !== "") {
      console.warn("[Contact Honeypot] Spam submission detected and silently discarded.");
      return NextResponse.json(
        { success: true, message: "Submission captured successfully." },
        { status: 200 }
      );
    }

    // Server-side validation check
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Email format sanity check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // =========================================================================
    // THIRD-PARTY INTEGRATION EXAMPLES
    // =========================================================================
    //
    // Example 1: Resend SDK
    // ----------------------
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'ApexToolHub Form <onboarding@resend.dev>',
    //   to: 'your-personal-email@domain.com',
    //   subject: `[ApexToolHub Support] ${subject}`,
    //   text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    // });
    //
    // Example 2: Web3Forms API
    // --------------------------
    // const res = await fetch("https://api.web3forms.com/submit", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     access_key: process.env.WEB3FORMS_ACCESS_KEY,
    //     name,
    //     email,
    //     subject: `[ApexToolHub Support] ${subject}`,
    //     message,
    //   }),
    // });
    // if (!res.ok) throw new Error("Mail submission failed.");
    //
    // =========================================================================

    // Log the message receipt locally for server console diagnostics
    console.log(`[Contact Form Received] From: ${name} <${email}> | Subject: ${subject}`);

    return NextResponse.json(
      { success: true, message: "Your message has been processed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Error] Error handling post request:", error);
    return NextResponse.json(
      { error: "Internal server error while processing message." },
      { status: 500 }
    );
  }
}
