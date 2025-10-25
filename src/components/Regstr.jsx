import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";
import './css/regstr.css';

export default function Regstr() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkbox = document.getElementById("p1");
    if (checkbox) checkbox.checked = false;
  }, []);

  const handleRegister = async () => {
    if (!email || !password || !repeatPassword) {
      setMessage('❌ Заполните все поля');
      return;
    }

    if (password !== repeatPassword) {
      setMessage('❌ Пароли не совпадают');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage('❌ Ошибка регистрации: ' + error.message);
      return;
    }

    // Проверяем, активна ли сессия сразу после регистрации
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', session.user.email);

      const checkbox = document.getElementById("p1");
      if (checkbox) checkbox.checked = false;

      setMessage('✅ Регистрация успешна! Вход выполнен.');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } else {
      setMessage('⚠️ Регистрация прошла, но сессия не активна. Проверь настройки Supabase.');
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