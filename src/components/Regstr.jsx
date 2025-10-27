import React, { useState } from "react";
import './css/regstr.css';

export default function Regstr() {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSendCode = async () => {
    if (!phone) {
      setMessage('❌ Введите номер телефона');
      return;
    }

    try {
      const response = await fetch('/api/send-sms-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorJson = await response.json();
          setMessage('❌ Ошибка отправки SMS: ' + (errorJson.error || ''));
        } else {
          const errorText = await response.text();
          setMessage('❌ Ошибка отправки SMS: ' + errorText);
        }
        return;
      }

      setMessage('📲 Код подтверждения отправлен на телефон');
      setShowPopup(true);
    } catch (err) {
      setMessage('❌ Ошибка соединения: ' + err.message);
    }
  };

  const handleRegister = async () => {
    if (!phone || !username || !password || !repeatPassword || !confirmationCode) {
      setMessage('❌ Заполните все поля');
      return;
    }

    if (password !== repeatPassword) {
      setMessage('❌ Пароли не совпадают');
      return;
    }

    try {
      const response = await fetch('/api/verify-sms-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: confirmationCode })
      });

      const result = await response.json();

      if (!result.verified) {
        setMessage('❌ Неверный код подтверждения');
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPhone', phone);
      setMessage('✅ Регистрация успешна!');
      setShowPopup(false);
    } catch (err) {
      setMessage('❌ Ошибка проверки кода: ' + err.message);
    }
  };

  return (
    <div className="block-chek">
      <h1 className="h1">Регистрация</h1>
      <p className="p1">Music.kg</p>

      <input
        className="input"
        type="text"
        placeholder="Номер телефона (+996...)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /> <br />

      <input
        className="input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /> <br />

      <input
        className="input"
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /> <br />

      <input
        className="input"
        type="password"
        placeholder="Повторите пароль"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      /> <br />

      <button className="vx" onClick={handleSendCode}>Отправить код подтверждения</button> <br />

      {message && <p className="reg-message">{message}</p>}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Введите код из SMS</h3>
            <input
              className="input"
              type="text"
              placeholder="Код из SMS"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
            <button className="vx" onClick={handleRegister}>Подтвердить и зарегистрироваться</button>
          </div>
        </div>
      )}
    </div>
  );
}