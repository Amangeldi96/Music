Deno.serve(async (req: Request) => {
  try {
    const body = (await req.json()) as { phone?: string };
    const { phone } = body;

    if (!phone || typeof phone !== "string" || phone.length > 20) {
      return new Response(JSON.stringify({ error: "Неверный номер телефона" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const sid = Deno.env.get("TWILIO_SID");
    const token = Deno.env.get("TWILIO_AUTH_TOKEN");
    const verifySid = Deno.env.get("TWILIO_VERIFY_SID");

    if (!sid || !token || !verifySid) {
      return new Response(JSON.stringify({ error: "Twilio переменные окружения не заданы" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const auth = btoa(`${sid}:${token}`);

    const params = new URLSearchParams();
    params.append("To", phone);
    params.append("Channel", "sms");

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${verifySid}/Verifications`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const result: { status?: string; message?: string } = await response.json();

    if (!response.ok) {
      console.error("Twilio error:", result);
      return new Response(JSON.stringify({ error: result.message || "Ошибка Twilio" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    return new Response(JSON.stringify({ success: true, status: result.status }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: any) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: `Ошибка: ${err.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
