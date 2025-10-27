export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email и код обязательны' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [email],
        subject: 'Код подтверждения',
        text: `Ваш код подтверждения: ${code}`
      })
    });

    const contentType = response.headers.get('content-type');
    const rawResponse = await response.text(); // 👈 логируем весь ответ

    console.log('📨 Resend response:', rawResponse); // 👈 лог в консоль Vercel

    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorJson = JSON.parse(rawResponse);
          return res.status(500).json({ error: errorJson.error || 'Ошибка API Resend' });
        } catch (parseErr) {
          return res.status(500).json({ error: 'Ошибка парсинга JSON: ' + parseErr.message });
        }
      } else {
        return res.status(500).json({ error: rawResponse });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}