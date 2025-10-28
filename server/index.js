const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const twilio = require('twilio');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Twilio клиент
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Отправка SMS-кода
app.post('/send-sms', async (req, res) => {
  const { phone } = req.body;

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return res.status(400).json({ error: 'Номер телефона обязателен и должен быть строкой' });
  }

  try {
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: phone,
        channel: 'sms'
      });

    console.log('✅ Twilio статус:', verification.status);
    res.status(200).json({ success: true, status: verification.status });
  } catch (error) {
    console.error('❌ Twilio ошибка:', error.message);
    res.status(500).json({ error: error.message || 'Ошибка отправки SMS' });
  }
});

// ✅ Проверка SMS-кода
app.post('/verify-sms', async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Телефон и код обязательны' });
  }

  try {
    const verificationCheck = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: phone,
        code: code
      });

    const verified = verificationCheck.status === 'approved';
    console.log('🔍 Проверка кода:', verificationCheck.status);

    res.json({ verified });
  } catch (error) {
    console.error('❌ Ошибка проверки:', error.message);
    res.status(500).json({ error: error.message || 'Ошибка проверки кода' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`));