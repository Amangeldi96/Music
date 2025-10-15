import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/regstr.css';

export default function Regstr() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!email || !password || !repeatPassword) {
      setMessage('❌ Заполните все поля');
      return;
    }

    if (password !== repeatPassword) {
      setMessage('❌ Пароли не совпадают');
      return;
    }

    // Сохраняем данные регистрации
    localStorage.setItem('regEmail', email);
    localStorage.setItem('regPassword', password);

    // Сохраняем флаг входа
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedEmail', email);

    setMessage('✅ Регистрация прошла успешно!');

    // Переход на страницу профиля через 1 секунду
    setTimeout(() => {
      navigate('/profile');
    }, 1000);
  };

  return (
    <div className="block-chek">
      <h1 className="h1">Регистрация</h1>
      <p className="p1">Music.kg</p>

      <input
        className="input"
        type="text"
        placeholder="Email или телефон"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      <button className="vx" onClick={handleRegister}>Регистрация</button>

      {message && <p className="reg-message">{message}</p>}
    </div>
  );
}