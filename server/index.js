const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

app.post('/send-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).send('Email и код обязательны');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'hobbyplus312@gmail.com',
        to: [email],
        subject: 'Код подтверждения',
        text: `Ваш код подтверждения: ${code}`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).send(errorText);
    }

    res.send({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
