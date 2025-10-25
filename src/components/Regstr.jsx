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

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMessage('❌ Ошибка регистрации: ' + signUpError.message);
      return;
    }

    // Пробуем войти вручную сразу после регистрации
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setMessage('⚠️ Регистрация прошла, но вход невозможен. Проверь настройки Supabase.');
    } else {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);

      const checkbox = document.getElementById("p1");
      if (checkbox) checkbox.checked = false;

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