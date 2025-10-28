const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type должен быть application/json' });
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Тело запроса должно быть JSON-объектом' });
  }

  const { phone } = req.body;

  console.log('📞 Получен номер:', phone);

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return res.status(400).json({ error: 'Номер телефона обязателен и должен быть строкой' });
  }

  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: phone,
        channel: 'sms'
      });

    console.log('✅ Twilio статус:', verification.status);

    return res.status(200).json({ success: true, status: verification.status });
  } catch (error) {
    console.error('❌ Twilio ошибка:', error.message);
    return res.status(500).json({ error: error.message || 'Ошибка отправки SMS' });
  }
};