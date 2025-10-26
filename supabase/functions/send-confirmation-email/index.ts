import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return new Response("Missing email or code", { status: 400 });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response("Missing RESEND_API_KEY", { status: 500 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@yourdomain.com", // заменишь на свой домен
        to: email,
        subject: "Код подтверждения",
        html: `<p>Здравствуйте! Ваш код подтверждения: <strong>${code}</strong></p>`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`Ошибка отправки письма: ${errorText}`, { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(`Ошибка: ${err.message}`, { status: 500 });
  }
});