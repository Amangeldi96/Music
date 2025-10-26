import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";
import './css/regstr.css';

export default function Regstr() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkbox = document.getElementById("p1");
    if (checkbox) checkbox.checked = false;
  }, []);

  const handleSendCode = async () => {
    if (!email) {
      setMessage('❌ Введите email');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    try {
      const response = await fetch('https://iqvkeeegqhlibdjmjrdm.functions.supabase.co/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage('❌ Ошибка отправки письма: ' + errorText);
      } else {
        setMessage('📧 Код подтверждения отправлен на email');
        setShowPopup(true);
      }
    } catch (err) {
      setMessage('❌ Ошибка соединения: ' + err.message);
    }
  };

  const handleRegister = async () => {
    if (!email || !username || !password || !repeatPassword || !confirmationCode) {
      setMessage('❌ Заполните все поля');
      return;
    }

    if (password !== repeatPassword) {
      setMessage('❌ Пароли не совпадают');
      return;
    }

    if (confirmationCode !== generatedCode) {
      setMessage('❌ Неверный код подтверждения');
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMessage('❌ Ошибка регистрации: ' + signUpError.message);
      return;
    }

    const userId = signUpData?.user?.id;
    if (userId) {
      await supabase.from('profiles').insert([{ id: userId, username }]);
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setMessage('⚠️ Регистрация прошла, но вход невозможен. Проверь настройки Supabase.');
    } else {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      setMessage('✅ Регистрация и вход успешны!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }
  };

  return (
    <div className="block-chek">
      <h1 className="h1">Регистрация</h1>
      <p className="p1">Music.kg</p>

      <input
        className="input"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
            <h3>Введите код подтверждения</h3>
            <input
              className="input"
              type="text"
              placeholder="Код из email"
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